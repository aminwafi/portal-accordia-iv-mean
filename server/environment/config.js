const nodemailer = require("nodemailer");

const smtpConfig = {
    base: {
        node_env: process.env.NODE_ENV || "local",
    },
    local: {
        host: "localhost",
        port: 1025,
        secure: false,
        from: 'donotreply@accordia.com'
    },
    dev: {},
    staging: {},
    prod: {}
}

const serverConfig = {
    base: {
        node_env: process.env.NODE_ENV || "local",
        port_number: process.env.PORT_NUMBER || 3000
    },
    local: {
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
        ...smtpConfig[smtpConfig.base.node_env]
    },
    SMTPTransport
}