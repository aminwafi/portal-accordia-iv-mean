const serverConfig = {
    BASE: {
        NODE_ENV: process.env.NODE_ENV || 'LOCAL',
        PORT_NUMBER: process.env.PORT_NUMBER || 3000
    },

    LOCAL: {

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