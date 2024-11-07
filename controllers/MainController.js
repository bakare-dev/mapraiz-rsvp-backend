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
}

module.exports = MainController;
