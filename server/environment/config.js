const nodemailer = require("nodemailer");

const smtpConfig = {
    local: {
        host: process.env.SMTP_HOST || "localhost",
        port: process.env.SMTP_PORT || 1025,
        secure: process.env.SMTP_SECURE || false,
        from: process.env.SMTP_FROM || 'donotreply@accordia.com'
    },
    dev: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        from: process.env.SMTP_FROM
    },
    staging: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        from: process.env.SMTP_FROM
    },
    prod: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        from: process.env.SMTP_FROM
    }
}

const serverConfig = {
    base: {
        node_env: process.env.NODE_ENV || "local",
        port_number: process.env.PORT_NUMBER || 3000
    },
    local: {
        jwt_secret: process.env.JWT_SECRET || '000000',
        DB_HOST: "localhost",
        DB_PORT: 3306,
        DB_USERNAME: "",
        DB_PASSWORD: "",
        DB_NAME: "",
    },
    dev: {},
    staging: {},
    prod: {}
};

const SMTPTransport = nodemailer.createTransport(smtpConfig[serverConfig.base.node_env]);

module.exports = {
    SERVER_ENV: {
        ...serverConfig.base,
        ...serverConfig[serverConfig.base.node_env]
    },
    SMTP_ENV: {
        ...smtpConfig.base,
        ...smtpConfig[serverConfig.base.node_env]
    },
    SMTPTransport
}