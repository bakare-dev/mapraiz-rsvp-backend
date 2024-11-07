const Logger = require("../utils/Logger");
const MainConstraint = require("../constraints/MainConstraint");
const MainService = require("../services/MainService");
const validate = require("validate.js");

let instance;

class MainController {
	#service;
	#constraint;
	#logger;

	constructor() {
		if (instance) return instance;

		this.#service = new MainService();
		this.#constraint = new MainConstraint();
		this.#logger = new Logger().getLogger();

		instance = this;
	}

	signIn = async (req, res) => {
		try {
			const validations = validate(req.body, this.#constraint.signIn());

			if (validations) {
				res.status(400).json({
					error: "validation error",
					validations,
				});
				return;
			}

			this.#service.signIn(req.body, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	getDashboard = async (req, res) => {
		try {
			this.#service.getDashboard(req.query, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	markMessageAsRead = async (req, res) => {
		try {
			this.#service.markMessageAsRead(req.query.messageId, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	attendee = async (req, res) => {
		try {
			this.#service.attendee(req.body, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	getGuest = async (req, res) => {
		try {
			this.#service.getGuest(req.query.token, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	validateKey = async (req, res) => {
		try {
			this.#service.validateKey(req.query.token, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};

	addGuest = async (req, res) => {
		try {
			this.#service.addGuest(req.body, (resp) => {
				res.status(resp.status).json(resp);
			});
		} catch (err) {
			this.#logger.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	};
}

module.exports = MainController;
