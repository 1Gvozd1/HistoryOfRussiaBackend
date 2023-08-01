import {Tokens} from "../model/Tokens.js";

class TokenRepository {
    async findOneById(user_id) {
        return await Tokens.findOne({where: {user_id}});
    }
    async findOneByRefreshToken(refreshToken) {
        return await Tokens.findOne({where: {refreshToken}});
    }
}

export default new TokenRepository()