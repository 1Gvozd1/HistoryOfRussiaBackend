import authService from "../service/auth/authService.js";
import {UserDto} from "../database/dto/userDto.js";
import {validationResult} from "express-validator";
import {ApiError} from "../exceptions/apiError.js";
import AuthService from "../service/auth/authService.js";

class AuthController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await authService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: process.env.JWT_REFRESH_AGE, httpOnly: true});
            return res.json(new UserDto(userData).json());
        } catch (e) {
            next(e)
        }
    }

    async verification(req, res, next) {
        try {
            return res.json(req.user);
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("RefreshToken не найден", errors.array()))
            }
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.status(200).json("success");
        } catch (e) {
            next(e)
        }
    }

    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка валидации", errors.array()))
            }

            const {username, email, password} = req.body;
            const userData = await authService.register(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: process.env.JWT_REFRESH_AGE, httpOnly: true})
            return res.json(new UserDto(userData).json())
        } catch (e) {
            next(e)
        }
    }

    async passwordReset(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Email не найден", errors.array()))
            }

            const {email} = req.body;
            await AuthService.passwordReset(email);

            return res.status(200).json("success");
        } catch (e) {
            next(e)
        }
    }

    async passwordConfirm(req, res, next) {
        try {
            const {pswToken, password} = req.body;
            await AuthService.passwordConfirm(pswToken, password);

            return res.status(200).json("success");
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLinkUUID = req.params.link;
            await authService.activate(activationLinkUUID);
            return res.redirect(process.env.CLIENT_URL + "/login");
        } catch (e) {
            next(e);
        }
    }

    async refreshtoken(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.UnauthorizedError())
            }

            const {refreshToken} = req.cookies;
            const userData = await authService.refreshToken(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: process.env.JWT_REFRESH_AGE, httpOnly: true});
            return res.json(new UserDto(userData).json());
        } catch (e) {
            next(e)
        }
    }
}

export default new AuthController()