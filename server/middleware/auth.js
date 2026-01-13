const jwt = require("jsonwebtoken");

const { status } = require("http-status");

const { SERVER_ENV } = require("../environment/config");

const dbLog = require("../utils/db-logger");
const msg = require("../environment/message");

function validateSchema(schema, property) {
    const actionType = dbLog.actionTypes.AUTH.VALIDATE_SCHEMA;

    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            console.error(err);
            dbLog.write(null, 'Error', actionType, msg.FAILURE.SCHEMA_VALIDATION_FAILED);
            return res.status(status.BAD_REQUEST).json({ message: msg.FAILURE.SCHEMA_VALIDATION_FAILED, status: 'error' });
        }

        req[property] = value;
        next();
    };
}

function authenticate(req, res, next) {
    const actionType = dbLog.actionTypes.AUTH.AUTHENTICATE;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        dbLog.write(null, 'Error', actionType, msg.FAILURE.MISSING_AUTHORIZATION_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.MISSING_AUTHORIZATION_TOKEN, status: 'error' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SERVER_ENV.jwt_secret);

        req.user = {
            ...payload,
            id: BigInt(payload.userId),
        };

        next();
    } catch (err) {
        console.error(err);
        dbLog.write(null, 'Error', actionType, msg.FAILURE.INVALID_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.INVALID_TOKEN, status: 'error' });
    }
}

function isVerifyOtp(req, res, next) {
    const actionType = dbLog.actionTypes.AUTH.AUTHENTICATE_VERIFY_OTP;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        dbLog.write(null, 'Error', actionType, msg.FAILURE.MISSING_AUTHORIZATION_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.MISSING_AUTHORIZATION_TOKEN, status: 'error' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SERVER_ENV.jwt_secret);
            
        if (payload.scope !== 'verify_otp') {
            dbLog.write(null, 'Error', actionType, msg.FAILURE.MISSING_TOKEN_SCOPE);
            return res.status(status.FORBIDDEN).json({ message: msg.FAILURE.MISSING_TOKEN_SCOPE, status: 'error' });
        }

        req.user = payload;

        next();
    } catch (err) {
        console.error(err);
        dbLog.write(null, 'Error', actionType, msg.FAILURE.INVALID_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.INVALID_TOKEN, status: 'error' });
    }
}

function isAdmin(req, res, next) {
    const actionType = dbLog.actionTypes.AUTH.AUTHENTICATE_ADMIN;

    if (!req.user.role === 'admin') {
        dbLog.write(null, 'Error', actionType, msg.FAILURE.MISSING_ADMIN_PRIVILEGE);
        return res.status(status.FORBIDDEN).json({ message: msg.FAILURE.MISSING_ADMIN_PRIVILEGE, status: 'error' });
    }

    next();
}

module.exports = {
    validateSchema,
    authenticate,
    isVerifyOtp,
    isAdmin
}