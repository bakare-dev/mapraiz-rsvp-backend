const Logger = require("./Logger");
const UserDService = require("../services/dataservices/UserService");
const bcrypt = require("bcrypt");
const Helper = require("./Helper");

let instance;
class Startup {
	#logger;
	#userDService;
	#helper;

	constructor() {
		if (instance) return instance;

		this.#logger = new Logger().getLogger();
		this.#userDService = new UserDService();
		this.#helper = new Helper();

		instance = this;
	}

	startMigration = async () => {
		try {
			this.#logger.info("Requirement Checks Started");

			await this.#userCheck();

			this.#logger.info("Requirement checks Completed");
		} catch (err) {
			this.#logger.error(err);
			process.exit(1);
		}
	};

	#userCheck = async () => {
		try {
			const password = this.#helper.generateRandomString(8);
			const token = this.#helper.generateRandomString(32);

			console.log(password);

			const admin = {
				emailAddress: "bakarepraise3@gmail.com",
				type: 2,
				password: await bcrypt.hash(password, 10),
				token: token,
			};

			const hasUserAdded = await this.#userDService.getUserByEmail(
				"bakarepraise3@gmail.com",
				(resp) => resolve(resp)
			);

			if (hasUserAdded) {
				this.#logger.info("Admin existed");
				return;
			}

			const user = await this.#userDService.create(admin);

			if (!user.id) {
				this.#logger.error("Error Occurred Adding admin");
				return;
			}

			// let url = "https://mapraiz-rsvp.vercel.app/sign-in"

			// const userNotification = {
			//     recipients: [ "bakarepraise3@gmail.com" ],
			//     data: {
			//         emailAddress: admin.emailAddress,
			//         password: password,
			//         url
			//     }
			// };

			// this.#notificationService.sendMainAdmin(userNotification, resp => {});

			this.#logger.info("admin added successfully");
		} catch (err) {
			this.#logger.error(err);
			return;
		}
	};
}

module.exports = Startup;
