const {Model, DataTypes} = require('sequelize');
const DatabaseEngine = require("../utils/DatabaseEngine");
const { v4: uuidv4 } = require('uuid');


const dbEngine = new DatabaseEngine();

class User extends Model{};

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.INTEGER, // 1-admin, 2-user
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: dbEngine.getConnectionManager()
    }
)

module.exports = User;