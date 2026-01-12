const express = require("express");
const cors    = require("cors");

const { SERVER_ENV } = require("./environment/config.js");
const routes = require("./routes/index.js");

const app = express();

BigInt.prototype.toJSON = function () {
    return this.toString();
}

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(SERVER_ENV.port_number, () => {
    console.log(`Server is listening on port ${SERVER_ENV.port_number}`);
});