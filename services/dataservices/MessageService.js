const Service = require("./Service");
const MessageEntity = require("../../entities/Message");
const Helper = require("../../utils/Helper");
const Guest = require("../../entities/Guest");

let instance;

class MessageService extends Service {
	#helper;

	constructor() {
		if (instance) return instance;

		super(MessageEntity);
		this.#helper = new Helper();

		instance = this;
	}

	getMessages = async () => {
		let response;
		response = await MessageEntity.findAndCountAll({
			order: [["createdAt", "DESC"]],
		});

		return response;
	};
}

module.exports = MessageService;
