import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {ApiError} from "../../exceptions/apiError.js";
import {AuthUserDto} from "../../database/dto/authUserDto.js";
import mailService from "./mailService.js";
import tokenService from "./tokenService.js";
import {Roles} from "../../database/model/Roles.js";
import UserRepository from "../../database/repository/userRepository.js";

class AuthService {
    async register(username, email, password) {
        const _user_username = await UserRepository.findOneByUsername(username);
        if (_user_username) {
            throw ApiError.BadRequest(`Пользователь с таким username ${username} уже существует`)
        }
        const _user_email = await UserRepository.findOneByEmail(email);
        if (_user_email) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLinkUUID = uuidv4();
        const created_at = new Date();

        const user = await UserRepository.createUser(
            {username, email, password: hashPassword, activationLink: activationLinkUUID, created_at})


        const activationLink = `${process.env.SITE_URL}/api/auth/activate/${activationLinkUUID}`


        await mailService.sendActivationMail(email, activationLink);

        const userDto = new AuthUserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async activate(activationLinkUUID) {
        const user = await UserRepository.findOneByActivationLink(activationLinkUUID);
        if (!user) {
            throw ApiError.BadRequest("Неккоректная ссылка активации")
        }
        user.activated = true;
        await user.save()
    }

    async login(email, password) {
        const _user = await UserRepository.findOneByEmail(email, Roles)
        if (!_user) {
            throw ApiError.BadRequest(`Пользователь с username '${email}' не существует`)
        }
        //if (!_user.activated) {
        //     throw ApiError.BadRequest(`Email не активирован`)
       // }

        const isPasswordsEquals = await bcrypt.compare(password, _user.password);
        if (!isPasswordsEquals) {
            throw ApiError.BadRequest(`Неверный пароль`)
        }

        const userDto = new AuthUserDto(_user);

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }


    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        if (!token) {
            throw ApiError.BadRequest("RefreshToken не обнаружен")
        }
    }

    async refreshToken(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenDB) {
            throw ApiError.UnauthorizedError();
        }

        const _user = await UserRepository.findOneById(userData.id, Roles);
        const userDto = new AuthUserDto(_user);

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async passwordReset(email) {
        const userData = await UserRepository.findOneByEmail(email);
        if (!userData) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} не существует`)
        }
        const resetLinkUUID = uuidv4();

        userData.resetLink = resetLinkUUID;
        userData.resetLinkCreatedAt = new Date();

        await userData.save()

        const resetLink = `${process.env.CLIENT_URL}/change?pswToken=${resetLinkUUID}`
        await mailService.sendPasswordResetMail(email, resetLink);
    }

    async passwordConfirm(pswToken, password) {
        const userData = await UserRepository.findOneByPswToken(pswToken);
        if (!userData) {
            throw ApiError.BadRequest(`Токен восстановления не существует`)
        }
        if (new Date().getTime() - userData.resetLinkCreatedAt.getTime() > 1000000000) { // 2h
            throw ApiError.BadRequest(`Срок действия токена восстановления истёк`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        userData.password = hashPassword;

        await userData.save();
    }
}

export default new AuthService()