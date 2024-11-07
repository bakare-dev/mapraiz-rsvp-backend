const Service = require("./Service");
const MessageEntity = require("../../entities/Message");
const Helper = require("../../utils/Helper");

let instance;

class MessageService extends Service {
	#helper;

	constructor() {
		if (instance) return instance;

		super(MessageEntity);
		this.#helper = new Helper();

		instance = this;
	}
}

module.exports = MessageService;
