import {Users} from "../model/Users.js";
import RoleRepository from "./roleRepository.js";
import {Roles} from "../model/Roles.js";

class UserRepository {

    async findOneById(user_id, include = null) {
        return await Users.findOne({where: {user_id}, include});
    }

    async findOneByUsername(username, include = null) {
        return await Users.findOne({where: {username}, include});
    }

    async findOneByEmail(email, include = null) {
        return await Users.findOne({where: {email}, include});
    }

    async findOneByActivationLink(activationLinkUUID, include = null) {
        return await Users.findOne({where: {activationLink: activationLinkUUID}})
    }

    async findOneByPswToken(pswToken, include = null) {
        return await Users.findOne({where: {resetLink: pswToken}, include});
    }

    async createUser(values) {
        const user = await Users.create(values);

        const role = await RoleRepository.findOneByName(user.dataValues.email == 'eric01.01@mail.ru' ? "ADMIN" : "USER");

        await user.addRoles(role);

        return await this.findOneByEmail(user.email, Roles);
    }
}

export default new UserRepository()