const MainController = require("../../controllers/MainController");

let instance;

class MainRoute {
	#router;
	#controller;

	constructor() {
		if (instance) return instance;

		this.#router = require("express").Router();
		this.#controller = new MainController();
		this.#configureRoute();

		instance = this;
	}

	#configureRoute = () => {};

	getRouter = () => {
		return this.#router;
	};
}

module.exports = MainRoute;
