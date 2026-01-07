const serverConfig = {
    BASE: {
        NODE_ENV: process.env.NODE_ENV || "LOCAL",
        PORT_NUMBER: process.env.PORT_NUMBER || 3000
    },

    LOCAL: {
        DB_HOST: "localhost",
        DB_PORT: 3306,
        DB_USERNAME: "",
        DB_PASSWORD: "",
        DB_NAME: ""
    },

    DEV: {

    },

    STAGING: {

    },

    PROD: {

    }
};

module.exports = {
    SERVER_ENV: {
        ...serverConfig.BASE,
        ...serverConfig[serverConfig.BASE.NODE_ENV]
    }
}