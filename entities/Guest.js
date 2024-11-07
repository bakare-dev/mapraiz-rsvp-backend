const { Model, DataTypes } = require("sequelize");
const DatabaseEngine = require("../utils/DatabaseEngine");
const { v4: uuidv4 } = require("uuid");
const User = require("./User");

const dbEngine = new DatabaseEngine();

class UserProfile extends Model {}

UserProfile.init(
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
		token: {
			type: DataTypes.STRING,
		},
		willAttend: {
			type: DataTypes.BOOLEAN,
			default: false,
		},
	},
	{
		sequelize: dbEngine.getConnectionManager(),
	}
);

module.exports = UserProfile;
