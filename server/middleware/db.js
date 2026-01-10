const { PrismaClient } = require("@prisma/client");

const { SERVER_ENV } = require("../environment/config");

const prisma = new PrismaClient({
    log: SERVER_ENV.db_log_options,
    datasources: {
        db:
        {
            url: `mysql://${SERVER_ENV.db_username}:${SERVER_ENV.db_password}@${SERVER_ENV.db_hostname}:${SERVER_ENV.db_port_number}/${SERVER_ENV.db_name}`
        }
    }
});

module.exports = prisma;