let instance;

class Helper {
	constructor() {
		if (instance) return instance;

		instance = this;
	}

	paginate = (page, size) => {
		const pageInt = Number.parseInt(page);
		const sizeInt = Number.parseInt(size);

		let localPage = 0;
		let localSize = 50;

		if (!Number.isNaN(pageInt) && pageInt > 0) {
			localPage = pageInt;
		}

		if (!Number.isNaN(sizeInt) && sizeInt > 0 && sizeInt <= 50) {
			localSize = sizeInt;
		}

		const offset = localPage * localSize;
		const limit = localSize;

		return {
			offset,
			limit,
		};
	};

	generateRandomString(length) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let randomString = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			randomString += characters[randomIndex];
		}

		return randomString;
	}
}

module.exports = Helper;
