const Service = require("./Service");
const GuestEntity = require("../../entities/Guest");
const Helper = require("../../utils/Helper");

let instance;

class GuestService extends Service {
	#helper;
	constructor() {
		if (instance) return instance;

		super(GuestEntity);

		this.#helper = new Helper();

		instance = this;
	}

	getGuests = async (page, size) => {
		let response;
		response = await GuestEntity.findAndCountAll({
			order: [["createdAt", "DESC"]],
			...this.#helper.paginate(page, size),
		});

		if (page && page != "undefined") {
			response.currentPage = page;
		} else {
			response.currentPage = "0";
		}

		if (size && size != "undefined") {
			response.currentSize = size;
		} else {
			response.currentSize = "50";
		}

		return response;
	};

	getAttendeeCount = async () => {
		const guests = await GuestEntity.findAll({
			where: {
				isAttending: true,
			},
		});

		const totalAttendees = guests.reduce((count, guest) => {
			return count + (guest.taggingAlong || 0) + 1;
		}, 0);

		return totalAttendees;
	};

	getGuest = async (token) => {
		return await GuestEntity.findOne({
			where: {
				token: token,
			},
		});
	};

	getGuestByContact = async (contact) => {
		return await GuestEntity.findOne({
			where: {
				contact,
			},
		});
	};

	getGuestByName = async (name) => {
		return await GuestEntity.findOne({
			where: {
				name,
			},
		});
	};
}

module.exports = GuestService;
