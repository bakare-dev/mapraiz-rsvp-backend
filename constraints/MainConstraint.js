let instance;

class MainConstraint {
	constructor() {
		if (instance) return instance;

		instance = this;
	}

	signIn = () => {
		return {
			email: {
				presence: true,
				email: true,
			},
			password: {
				presence: true,
				length: {
					minimum: 6,
				},
			},
		};
	};
}

module.exports = MainConstraint;
