const { Model, DataTypes } = require("sequelize");
const DatabaseEngine = require("../utils/DatabaseEngine");
const { v4: uuidv4 } = require("uuid");
const Guest = require("./Guest");

const dbEngine = new DatabaseEngine();

class Message extends Model {}

Message.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING(500),
			allowNull: false,
		},
		isRead: {
			type: DataTypes.BOOLEAN,
			default: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		sequelize: dbEngine.getConnectionManager(),
	}
);

module.exports = Message;
