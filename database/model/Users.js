import {sequelize} from "../../config/database.js";
import {DataTypes} from "sequelize";

export const Users = sequelize.define("users", {

    user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, required: true},
    username: {type: DataTypes.STRING, unique: true, required: true},
    email: {type: DataTypes.STRING, unique: true, required: true},
    password: {type: DataTypes.STRING, required: true},

    activated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    resetLink: {type: DataTypes.STRING},
    resetLinkCreatedAt: {type: DataTypes.DATE},
    created_at: {type: DataTypes.DATE, required: true}
})