const Service = require("./Service");
const UserEntity = require("../../entities/User");
const Helper = require("../../utils/Helper");
const User = require("../../entities/User");

let instance;

class UserService extends Service {
	#helper;

	constructor() {
		if (instance) return instance;

		super(UserEntity);
		this.#helper = new Helper();

		instance = this;
	}

	getUserByEmail = async (email) => {
		return await UserEntity.findOne({
			where: {
				emailAddress: email,
			},
		});
	};

	getUserByToken = async (token) => {
		return await UserEntity.findOne({
			where: {
				token: token,
			},
		});
	};
}

module.exports = UserService;
