const Logger = require("../utils/Logger");
const NotificationService = require("./NotificationService");
const UserService = require("./dataservices/UserService");
const MessageService = require("./dataservices/MessageService");
const GuestService = require("./dataservices/GuestService");
const bcrypt = require("bcrypt");
const AuthenticationService = require("../utils/Authentication");
const Helper = require("../utils/Helper");

let instance;

class MainService {
	#logger;
	#notificationService;
	#guestService;
	#userService;
	#messageService;
	#authService;
	#helper;

	constructor() {
		if (instance) return instance;

		this.#logger = new Logger().getLogger();
		this.#notificationService = new NotificationService();
		this.#guestService = new GuestService();
		this.#userService = new UserService();
		this.#messageService = new MessageService();
		this.#authService = new AuthenticationService();
		this.#helper = new Helper();

		instance = this;
	}

	signIn = async (payload, callback) => {
		try {
			const { email, password } = payload;

			const user = await this.#userService.getUserByEmail(email);

			if (!user) {
				callback({ status: 404, error: "Invalid email or password" });
				return;
			}

			const isPasswordValid = await bcrypt.compare(
				password,
				user.password
			);

			if (!isPasswordValid) {
				callback({ status: 404, error: "Invalid email or password" });
				return;
			}

			this.#authService.generateTokens(user.id, (resp) => {
				callback({
					status: 200,
					data: {
						token: resp.token,
						message: "Sign in successful",
					},
				});
			});
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	getDashboard = async (query, callback) => {
		try {
			const messages = await this.#messageService.getMessages();

			const count = await this.#guestService.getAttendeeCount();

			const guests = await this.#guestService.getGuests(
				query.page,
				query.size
			);

			const users = await this.#userService.fetchAll({});

			const token = users.rows[0].token;

			callback({ status: 200, data: { messages, count, guests, token } });
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	attendee = async (payload, callback) => {
		try {
			let guest;

			let guestExists = await this.#guestService.getGuestByContact(
				payload.contact
			);

			if (!guestExists) {
				guestExists = await this.#guestService.getGuestByName(
					payload.name
				);
			}

			let taggingAlong;
			if (payload.totalAttendees > 1) {
				taggingAlong = payload.totalAttendees - 1;
			} else {
				taggingAlong = 0;
			}

			if (payload.id) {
				await this.#guestService.update(payload.id, {
					isAttending: payload.isAttending,
					taggingAlong,
					used: true,
				});

				guest = await this.#guestService.findById(payload.id);
			} else {
				if (!guestExists) {
					const token = this.#helper.generateRandomString(16);
					const newGuest = await this.#guestService.create({
						name: payload.name,
						contact: payload.contact,
						token,
						taggingAlong,
						isAttending: payload.isAttending,
						used: true,
					});

					if (!newGuest.id) {
						callback({ status: 500, error: "Try again later" });
						return;
					}
					guest = newGuest;
				} else {
					callback({
						status: 400,
						error: "Check your mail for your invitation link",
					});
					return;
				}
			}

			if (payload.message != "") {
				await this.#messageService.create({
					message: payload.message,
					name: payload.name,
				});
			} else {
				payload.message = "";
			}

			const userNotificationPayload = {
				recipients: [
					"bakarepraise04@gmail.com",
					"bakaresolabomi@gmail.com",
				],
				data: {
					name: payload.name,
					isAttending: payload.isAttending,
					taggingAlong,
					message: payload.message,
				},
			};

			const guestNotificationPayload = {
				recipients: [payload.contact],
				data: {
					name: payload.name,
					isAttending: payload.isAttending,
					taggingAlong,
					token: guest.token || "",
				},
			};

			if (guestNotificationPayload.data.isAttending) {
				this.#notificationService.sendAttendingNotification(
					guestNotificationPayload,
					(resp) => {}
				);

				this.#notificationService.sendAdminAttendingNotification(
					userNotificationPayload,
					(resp) => {}
				);
			} else {
				this.#notificationService.sendNotAttendingNotification(
					guestNotificationPayload,
					(resp) => {}
				);
				this.#notificationService.sendAdminNotAttendingNotification(
					userNotificationPayload,
					(resp) => {}
				);
			}

			callback({ status: 200, data: { message: "Thank you" } });
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	markMessageAsRead = async (messageId, callback) => {
		try {
			await this.#messageService.update(messageId, { isRead: true });

			callback({
				status: 200,
				data: { message: "Message marked as read" },
			});
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	addGuest = async (payload, callback) => {
		try {
			const token = this.#helper.generateRandomString(16);

			const newGuest = await this.#guestService.create({
				name: payload.name,
				contact: payload.contact,
				token,
			});

			if (!newGuest.id) {
				callback({ status: 500, error: "Try again later" });
				return;
			}

			const guestNotificationPayload = {
				recipients: [payload.contact],
				data: {
					name: payload.name,
					token: newGuest.token,
				},
			};

			this.#notificationService.sendInvitationNotification(
				guestNotificationPayload,
				(resp) => {}
			);

			callback({ status: 200, data: { message: "Guest added" } });
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	getGuest = async (token, callback) => {
		try {
			const guest = await this.#guestService.getGuest(token);

			if (!guest) {
				callback({ status: 404, error: "Guest not Found" });
				return;
			}

			callback({ status: 200, data: { guest } });
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};

	validateKey = async (token, callback) => {
		try {
			const user = await this.#userService.getUserByToken(token);

			if (!user) {
				callback({ status: 401, error: "Invalid Key" });
				return;
			}

			callback({ status: 200, data: { message: "valid key" } });
		} catch (err) {
			this.#logger.error(err.message);
			callback({ status: 500, error: "Internal server error" });
		}
	};
}

module.exports = MainService;
