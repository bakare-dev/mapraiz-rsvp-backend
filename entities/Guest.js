const { Model, DataTypes } = require("sequelize");
const DatabaseEngine = require("../utils/DatabaseEngine");
const { v4: uuidv4 } = require("uuid");
const User = require("./User");

const dbEngine = new DatabaseEngine();

class Guest extends Model {}

Guest.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contact: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		taggingAlong: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		token: {
			type: DataTypes.STRING,
		},
		isAttending: {
			type: DataTypes.BOOLEAN,
			default: false,
		},
		used: {
			type: DataTypes.BOOLEAN,
			default: false,
		},
	},
	{
		sequelize: dbEngine.getConnectionManager(),
	}
);

module.exports = Guest;
