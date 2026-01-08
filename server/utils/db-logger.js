const prisma    = require("../middleware/db");

const actionTypes = {
    AUTH: {
        REGISTER: 'Create new user via registration',
        LOGIN: 'Login',
        LOGOUT: 'Logout',
        FORGOT: 'Forgot password',
        RESET_PASSWORD: 'Reset password',
        GENERATE_OTP: 'Generate otp',
        VERIFY: 'Verify otp',
        SEND_OTP: 'Send otp'
    },
};

async function writeLogToDB(userId, logType, actionType, description) {
    try {
        await prisma.log.create({
            data: {
                userId: userId,
                logType: logType,
                actionType: actionType,
                description: description
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    actionTypes: actionTypes,
    write: writeLogToDB
}