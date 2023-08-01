import {ApiError} from "../exceptions/apiError.js";
import tokenService from "../service/auth/tokenService.js";

export default function (role) {
    return function (req, res, next) {

        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError());
            }
            const accessToken = authorizationHeader.split(" ")[1];
            if (!accessToken) {
                return next(ApiError.UnauthorizedError());
            }

            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return next(ApiError.UnauthorizedError());
            }

            if (!userData.roles.includes(role)) {
                return next(ApiError.Forbidden());
            }

            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    }
}

