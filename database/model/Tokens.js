import {sequelize} from "../../config/database.js";
import {DataTypes} from "sequelize";

export const Tokens = sequelize.define("tokens", {
    token_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, required: true},
    refreshToken: {type: DataTypes.STRING(300)}
})