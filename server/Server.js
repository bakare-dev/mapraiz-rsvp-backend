"use strict";
const express = require("express");
const cors = require("cors");
const Logger = require("../utils/Logger");
const Redis = require("../utils/Redis");
const http = require("http");
const fs = require("fs");
const path = require("path");
const MainRoute = require("./routes/MainRoute");

let instance;

class Server {
	#app;
	#port;
	#logger;
	#rateLimitWindowMs = 30000;
	#maxRequestsPerWindow = 10;
	#redis;

	constructor(port) {
		if (instance) return instance;

		this.#port = port;
		this.#configure();
		this.#buildRoutes();
		this.#redis = new Redis();
		this.#logger = new Logger().getLogger();

		instance = this;
	}

	#configure = () => {
		this.#app = express();
		this.#app.use(express.json());
		this.#app.set("trust proxy", true);

		this.#app.use(
			cors({
				origin: "*",
				methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
				allowedHeaders:
					"Content-Type, Authorization, source, auth_mode",
				credentials: true,
				optionsSuccessStatus: 200,
			})
		);

		this.#app.use(this.#checkRateLimit);
	};

	#checkRateLimit = async (req, res, next) => {
		const ip = req.ip;
		const requestKey = `rate_limit:${ip}`;

		const requests = await this.#redis.incr(requestKey);

		if (requests === 1) {
			await this.#redis.expire(
				requestKey,
				this.#rateLimitWindowMs / 1000
			);
		}

		if (requests > this.#maxRequestsPerWindow) {
			return res.status(429).json({
				error: "We’re currently processing your previous requests. Try again shortly.",
			});
		}

		next();
	};

	#buildRoutes = () => {
		this.#app.get("/api/v1/health", async (req, res) => {
			const healthInfo = {
				status: "Server is up and running",
			};

			res.status(200).json(healthInfo);
		});

		this.#app.use("/api/v1/", new MainRoute().getRouter());

		this.#app.get("/", (req, res) => {
			const message = {
				info: "You have reached mp-server",
				baseUrl: "/api/v1/",
				health: "/api/v1/health",
				docs: "/swagger",
			};
			res.json(message);
		});
	};

	start = async () => {
		this.#app.listen(this.#port, async () => {
			await this.#redis.connect();
			this.#logger.info(`mp-server now listening on port ${this.#port}`);
		});
	};

	getServerApp = () => {
		return this.#app;
	};
}

module.exports = Server;
