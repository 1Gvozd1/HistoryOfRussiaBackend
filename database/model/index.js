import {Users} from "./Users.js";
import {Roles} from "./Roles.js";
import {Tokens} from "./Tokens.js";

Users.hasOne(Tokens, {foreignKey: "user_id"});
Tokens.belongsTo(Users, {foreignKey: "user_id"});

Users.belongsToMany(Roles, {through: "user_roles", foreignKey: "user_id"});
Roles.belongsToMany(Users, {through: "user_roles", foreignKey: "role_id"});

export default {
    Users,
    Roles,
    Tokens
}