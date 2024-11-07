const Mailer = require("../utils/Mailer");

let instance;
class Service {
	#mailer;

	constructor() {
		if (instance) return instance;

		this.#mailer = new Mailer();

		instance = this;
	}

	sendInvitationNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@uhunger.com",
				templateFile: "verify-registration.ejs",
				subject: "Account Created Successfully",
				recipients: item,
				data: message.data,
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};

	sendOnboardingNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@uhunger.com",
				templateFile: "verify-registration.ejs",
				subject: "Account Created Successfully",
				recipients: item,
				data: message.data,
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};
}

module.exports = Service;
