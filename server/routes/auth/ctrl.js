const crypto    = require("crypto");
const bycrpt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");

const prisma    = require("../../middleware/db");
const msg       = require("../../environment/message");
const dbLog     = require("../../utils/db-logger");

const { status } = require("http-status");

async function register(req, res) {
    const actionType = dbLog.actionTypes.AUTH.REGISTER;
    const email = req.body.email.toLowerCase();
    
    // CREATE USERNAME
    const baseEmail = email.split('@');
    const username  = baseEmail + '_' + crypto.createHash('sha256').update(email).digest('hex').slice(0, 8);

    var password = req.body.password;

    bycrpt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            password = hash;
        })
    });

    try {
        const user = await prisma.create.users({
            data: {
                email: email,
                username: username,
                password: password,
                role: "user"
            }
        });

        dbLog.write(user.userId, 'Info', actionType, `${msg.SUCCESS.USER_CREATED}: ${email}`);
        return res.status(status.CREATED).json({ 
            message: msg.SUCCESS.USER_CREATED, 
            status: 'success', 
            user: {
                username: user.username,
                email: user.email
            } 
        });
    } catch (err) {
        if (err.code === "P2002") {
            const target = err.meta?.target;

            if (target?.includes("email")) {
                dbLog.write(null, 'Error', actionType, `${msg.FAILURE.EMAIL_EXISTS}: ${email}`);
                return res.status(status.CONFLICT).json({ message: msg.FAILURE.EMAIL_EXISTS, status: 'error' });
            }
            
            if (target?.includes("username")) {
                dbLog.write(null, 'Error', actionType, `${msg.FAILURE.USERNAME_EXISTS}: ${username}`);
                return res.status(status.CONFLICT).json({ message: msg.FAILURE.USERNAME_EXISTS, status: 'error' })
            }
        }
    }
}

module.exports = {
    register
}