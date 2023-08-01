import {sequelize} from "../../config/database.js";
import {DataTypes} from "sequelize";

const ROLES_ENUM = ["USER", "MODER", "ADMIN"];

export const Roles = sequelize.define("roles", {
    role_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, required: true},
    name: {type: DataTypes.ENUM, values: ROLES_ENUM}
})