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
				sender: "noreply@mapraizllc.com",
				templateFile: "invitation.ejs",
				subject: "Dr Bola Talabi Reese 80th Birthday Invitation",
				recipients: item,
				data: message.data,
				attachments: [
					{
						filename:
							"Dr Bola Talabi Reese 80th Birthday Invitation",
						path: process.cwd() + "/tempFiles/card.png",
					},
				],
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};

	sendAttendingNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@mapraizllc.com",
				templateFile: "attending.ejs",
				subject:
					"RSVP Confirmation - Dr Bola Talabi Reese 80th Birthday",
				recipients: item,
				data: message.data,
				attachments: [
					{
						filename:
							"Dr Bola Talabi Reese 80th Birthday Invitation",
						path: process.cwd() + "/tempFiles/card.png",
					},
				],
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};

	sendAdminAttendingNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@mapraizllc.com",
				templateFile: "admin-attending.ejs",
				subject: "RSVP Update - Dr Bola Talabi Reese 80th Birthday",
				recipients: item,
				data: message.data,
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};

	sendNotAttendingNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@mapraizllc.com",
				templateFile: "notattending.ejs",
				subject: "RSVP - Dr Bola Talabi Reese 80th Birthday",
				recipients: item,
				data: message.data,
			};

			this.#mailer.sendMail(info, (response) => {
				callback(response);
			});
		});
	};

	sendAdminNotAttendingNotification = async (message, callback) => {
		message.recipients.forEach(async (item) => {
			let info = {
				sender: "noreply@mapraizllc.com",
				templateFile: "admin-notattending.ejs",
				subject: "RSVP Update - Dr Bola Talabi Reese 80th Birthday",
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
