const crypto    = require("crypto");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");

const { status } = require("http-status");

const prisma    = require("../../middleware/db");
const msg       = require("../../environment/message");
const dbLog     = require("../../utils/db-logger");
const emailCtrl = require("../email/ctrl");

async function register(req, res) {
    const actionType = dbLog.actionTypes.AUTH.REGISTER;
    const email = req.body.email.toLowerCase();
    
    // CREATE USERNAME
    const baseEmail = email.split('@')[0];
    const username  = baseEmail + '_' + crypto.createHash('sha256').update(email).digest('hex').slice(0, 8);

    const password = await bcrypt.hash(req.body.password, 10);

    try {
        const { code, hash } = await generateOtp();

        const user = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: password,
                role: "user",
                otps: {
                    create: {
                        code: hash,
                        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                    }
                }
            }
        });

        await sendOtp(user.username, email, code);

        await dbLog.write(user.id, 'Info', actionType, `${msg.SUCCESS.USER_CREATED}: ${email}`);
        return res.status(status.CREATED).json({ 
            message: msg.SUCCESS.USER_CREATED, 
            status: 'success', 
            user: {
                username: user.username,
                email: user.email
            } 
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

async function generateOtp() {
    const actionType = dbLog.actionTypes.AUTH.GENERATE_OTP;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const hash = crypto.createHash('sha256').update(code).digest('hex');

    await dbLog.write(null, 'Info', actionType, `${msg.SUCCESS.OTP_CREATED}`);
    return { code, hash };
}

async function sendOtp(username, email, code) {
    await emailCtrl.notificationEmail(username, email, code);
}

async function verifyOtp(req, res) {
    const actionType = dbLog.actionTypes.AUTH.VERIFY;
    const email = req.body.email.toLowerCase();
    const code  = req.body.code;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                otps: {
                    where: {
                       isUsed: false,
                       code: crypto.createHash('sha256').update(code).digest('hex') 
                    }
                }
            }
        });

        if (!user) {
            await dbLog.write(null, 'Error', actionType, `${msg.FAILURE.USER_NOT_FOUND}: ${email}`);
            return res.status(status.BAD_REQUEST).json({ message: msg.FAILURE.USER_NOT_FOUND, status: 'error' })
        }


    } catch (err) {

    }
}

async function login(req, res) {
    const actionType = dbLog.actionTypes.AUTH.LOGIN;
    const email = req.body.email.toLowerCase();

    
}

module.exports = {
    register,
    verifyOtp,
    login
}