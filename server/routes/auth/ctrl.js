const crypto    = require("crypto");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");

const { status } = require("http-status");

const { SERVER_ENV } = require("../../environment/config");

const prisma    = require("../../middleware/db");
const msg       = require("../../environment/message");
const dbLog     = require("../../utils/db-logger");
const emailCtrl = require("../email/ctrl");

function generateToken(user, scope) {
    const token = jwt.sign(
        {
            userId: user.id.toString(),
            username: user.username,
            role: user.role,
            scope: scope
        },
        SERVER_ENV.jwt_secret,
        {
            expiresIn: '1h'
        }
    );

    return token;
}

async function register(req, res) {
    const actionType = dbLog.actionTypes.AUTH.REGISTER;
    const email = req.body.email.toLowerCase();
    
    // CREATE USERNAME
    const baseEmail = email.split('@')[0];
    const username  = baseEmail + '_' + crypto.createHash('sha256').update(email).digest('hex').slice(0, 8);

    const password = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: password,
                role: "user"
            }
        });

        const code = await generateOtp(user);

        await sendOtp(user.username, user.email, code);

        const otpToken = generateToken(user, 'verify_otp');

        await dbLog.write(user.id, 'Info', actionType, `${msg.SUCCESS.USER_CREATED}: ${user.email}`);
        return res.status(status.CREATED).json({ 
            message: msg.SUCCESS.USER_CREATED, 
            status: 'success', 
            user: {
                id: user.id.toString(),
                email: user.email,
                username: user.username,
                role: user.role
            },
            otpToken
        });
    } catch (err) {
        console.error(err);

        if (err.code === "P2002") {
            const target = err.meta?.target;

            if (target?.includes("email")) {
                await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.EMAIL_EXISTS}: ${email}`);
                return res.status(status.CONFLICT).json({ message: msg.FAILURE.EMAIL_EXISTS, status: 'error' });
            }
            
            if (target?.includes("username")) {
                await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.USERNAME_EXISTS}: ${username}`);
                return res.status(status.CONFLICT).json({ message: msg.FAILURE.USERNAME_EXISTS, status: 'error' })
            }
        }

        await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.INTERNAL_SERVER_ERROR}`);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function generateOtp(user) {
    const actionType = dbLog.actionTypes.AUTH.GENERATE_OTP;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const hash = crypto.createHash('sha256').update(code).digest('hex');

    // INVALIDATE OLD OTP
    await prisma.otp.updateMany({
        where: {
            userId: user.id,
            isUsed: false
        },
        data: {
            isUsed: true
        }
    });

    await prisma.otp.create({
        data: {
            userId: user.id,
            code: hash,
            expireAt: new Date(Date.now() + 5 * 60 * 1000)
        }
    });

    await dbLog.write(null, 'Info', actionType, `${msg.SUCCESS.OTP_CREATED}`);

    return code;
}

async function sendOtp(username, email, code) {
    await emailCtrl.notificationEmail(username, email, code);
}

async function verifyOtp(req, res) {
    const actionType = dbLog.actionTypes.AUTH.VERIFY;
    const payload = req.user;

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.USER_NOT_FOUND}: ${payload.userId}`);
            return res.status(status.BAD_REQUEST).json({ message: msg.FAILURE.USER_NOT_FOUND, status: 'error' });
        }

        if (user.isVerified == true) {
            await dbLog.write(user.id, 'Error', actionType, `${msg.EXCEPTION.USER_ALREADY_VERIFIED}: ${user.email}`);
            return res.status(status.BAD_REQUEST).json({ message: msg.EXCEPTION.USER_ALREADY_VERIFIED, status: 'error' });
        }

        const code = await prisma.otp.findFirst({
            where: {
                userId: user.id,
                isUsed: false,
                code: crypto.createHash('sha256').update(req.body.code).digest('hex').toString(),
                expireAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!code) {
            await dbLog.write(user.id, 'Error', actionType, `${msg.FAILURE.OTP_NOT_FOUND}`);
            return res.status(status.BAD_REQUEST).json({ message: msg.FAILURE.OTP_NOT_FOUND, status: 'error' });
        }

        await prisma.$transaction([
            prisma.otp.update({
                where: { id: code.id },
                data: { isUsed: true }
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true }
            })
        ]);

        const token = generateToken(user);

        await dbLog.write(user.id, 'Info', actionType, `${msg.SUCCESS.USER_VERIFIED}: ${user.email}`);
        return res.status(status.OK).json({ message: msg.SUCCESS.USER_VERIFIED, 
            token, 
            status: 'success' });
    } catch (err) {
        console.error(err);
        
        await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.INTERNAL_SERVER_ERROR}`);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function login(req, res) {
    const actionType = dbLog.actionTypes.AUTH.LOGIN;
    const identifier = req.body.identifier.toLowerCase();

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.USER_NOT_FOUND}: ${identifier}`);
            return res.status(status.BAD_REQUEST).json({ message: msg.FAILURE.USER_NOT_FOUND, status: 'error' });
        }

        if ((await bcrypt.compare(req.body.password, user.password)) !== true) {
            await dbLog.write(user.id, 'Error', actionType, msg.FAILURE.INVALID_CREDENTIALS);
            return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.INVALID_CREDENTIALS, status: 'error' });
        }

        if (!user.isVerified) {
            const otpToken = generateToken(user, 'verify_otp');

            const code = await generateOtp(user);

            await sendOtp(user.username, user.email, code);

            await dbLog.write(user.id, 'Error', actionType, msg.EXCEPTION.USER_NOT_VERIFIED);
            return res.status(status.FORBIDDEN).json({ message: msg.EXCEPTION.USER_NOT_VERIFIED, status: 'error', otpToken });
        }

        const token = generateToken(user);

        await dbLog.write(user.id, 'Info', actionType, msg.SUCCESS.USER_AUTHENTICATED);
        return res.status(status.OK).json({ message: msg.SUCCESS.USER_AUTHENTICATED,
            token,
            status: 'success' });
    } catch (err) {
        console.error(err);
        
        await dbLog.write(null, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

module.exports = {
    register,
    verifyOtp,
    login
}