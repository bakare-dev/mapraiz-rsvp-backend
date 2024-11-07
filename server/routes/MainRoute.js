const MainController = require("../../controllers/MainController");
let instance;

class MainRoute {
	#router;
	#auth;
	#controller;

	constructor() {
		if (instance) return instance;

		this.#router = require("express").Router();
		this.#controller = new MainController();
		this.#configureRoute();

		instance = this;
	}

	#configureRoute = () => {
		this.#router.post("/sign-in", this.#controller.signIn);
		this.#router.post("/guest", this.#controller.addGuest);
		this.#router.post("/attend", this.#controller.attendee);
		this.#router.get("/guest", this.#controller.getGuest);
		this.#router.get("/validate", this.#controller.validateKey);
		this.#router.get("/dashboard", this.#controller.getDashboard);
		this.#router.put("/messages", this.#controller.markMessageAsRead);
	};

	getRouter = () => {
		return this.#router;
	};
}

module.exports = MainRoute;
