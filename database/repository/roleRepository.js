import {Roles} from "../model/Roles.js";

class RoleRepository {
    async findOneByName(name) {
        return await Roles.findOne({where: {name}});
    }
}

export default new RoleRepository()