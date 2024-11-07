const Logger = require("../utils/Logger");
const NotificationService = require("./NotificationService");
const UserService = require("./dataservices/UserService");
const MessageService = require("./dataservices/MessageService");
const GuestService = require("./dataservices/GuestService");

let instance;

class AdminService {
	#logger;
	#notificationService;
	#guestService;
	#userService;
	#messageService;

	constructor() {
		if (instance) return instance;

		this.#logger = new Logger().getLogger();
		this.#notificationService = new NotificationService();
		this.#guestService = new GuestService();
		this.#userService = new UserService();
		this.#messageService = new MessageService();

		instance = this;
	}

	logIn = async (payload, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	validateToken = async (payload, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	addGuest = async (payload, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	getGuests = async (query, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	willAttend = async (payload, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	willNotAttend = async (payload, callback) => {
		try {
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};
}

module.exports = AdminService;
