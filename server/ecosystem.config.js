module.exports = {
    apps: [{
        name: "portal-accordia-iv-mean-server",
        script: "./bin/www",
        env: {
            NODE_ENV: '',
            PORT_NUMBER: 3000
        }
    }]
}