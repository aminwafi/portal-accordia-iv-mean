const jwt = require("jsonwebtoken");

const { status } = require("http-status");

const { SERVER_ENV } = require("../environment/config");

const dbLog = require("../utils/db-logger");
const msg = require("../environment/message");

function authenticate(req, res, next) {
    const actionType = dbLog.actionTypes.AUTH.AUTHENTICATE;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        dbLog.write(null, 'Error', actionType, msg.FAILURE.MISSING_AUTHORIZATION_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.MISSING_AUTHORIZATION_TOKEN, status: 'error' });
    }

    const token = authHeader.split('')[1];

    try {
        const payload = jwt.verify(token, SERVER_ENV.jwt_secret);

        req.user = {
            id: BigInt(payload.user.id),
        };

        next();
    } catch (err) {
        console.error(err);
        dbLog.write(null, 'Error', actionType, msg.FAILURE.INVALID_TOKEN);
        return res.status(status.UNAUTHORIZED).json({ message: msg.FAILURE.INVALID_TOKEN, status: 'error' });
    }
}

module.exports = {
    authenticate
}