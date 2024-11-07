const Service = require("./Service");
const UserEntity = require("../../entities/User");
const Helper = require("../../utils/Helper");

let instance;

class UserService extends Service {
	#helper;

	constructor() {
		if (instance) return instance;

		super(UserEntity);
		this.#helper = new Helper();

		instance = this;
	}
}

module.exports = UserService;
