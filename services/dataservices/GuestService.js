const Service = require("./Service");
const GuestEntity = require("../../entities/Guest");

let instance;

class GuestService extends Service {


    constructor () {

        if (instance) return instance;

        super(GuestEntity)

        instance = this;
    }
}

module.exports = GuestService