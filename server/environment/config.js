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
        port_number: process.env.PORT_NUMBER || 3000,
    },
    local: {
        jwt_secret: process.env.JWT_SECRET || '000000',
        db_hostname: process.env.DB_HOSTNAME ||"localhost",
        db_port_number: process.env.DB_PORT_NUMBER || 3306,
        db_username: process.env.DB_USERNAME || "root",
        db_password: process.env.DB_PASSWORD || "admin",
        db_name: process.env.DB_NAME || "accordia_iv_mean",
        db_log_options: ["query", "info", "warn", "error"]
    },
    dev: {
        db_hostname: process.env.DB_HOSTNAME,
        db_port_number: process.env.DB_PORT_NUMBER,
        db_username: process.env.DB_USERNAME,
        db_password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
        db_log_options: ["error"]
    },
    staging: {
        db_hostname: process.env.DB_HOSTNAME,
        db_port_number: process.env.DB_PORT_NUMBER,
        db_username: process.env.DB_USERNAME,
        db_password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
        db_log_options: ["error"]
    },
    prod: {
        db_hostname: process.env.DB_HOSTNAME,
        db_port_number: process.env.DB_PORT_NUMBER,
        db_username: process.env.DB_USERNAME,
        db_password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
        db_log_options: ["error"]
    }
};

const SMTPTransport = nodemailer.createTransport(smtpConfig[serverConfig.base.node_env]);

module.exports = {
    SERVER_ENV: {
        ...serverConfig.base,
        ...serverConfig[serverConfig.base.node_env],
    },
    SMTP_ENV: smtpConfig[serverConfig.base.node_env],
    SMTPTransport
}