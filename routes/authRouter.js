import {Router} from "express";
import AuthController from "../controller/authController.js";
import {body, cookie} from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";


const authRouter = new Router();

authRouter.post("/login",
    body("email").exists(),
    body("password").isLength({min: 3, max: 32}).notEmpty(),
    AuthController.login
);

authRouter.get("/verification",
    authMiddleware,
    AuthController.verification
);

authRouter.get("/logout",
    cookie("refreshToken").exists(),
    AuthController.logout
);
authRouter.post("/register",
    body("username").exists(),
    body("email").isEmail().notEmpty(),
    body("password").isLength({min: 3, max: 32}).notEmpty(),
    AuthController.register
);
authRouter.get("/refreshtoken",
    cookie("refreshToken").exists(),
    AuthController.refreshtoken
);
authRouter.post("/password/reset",
    body("email").isEmail().notEmpty(),
    AuthController.passwordReset
);
authRouter.post("/password/confirm",
    body("pswToken").exists(),
    body("password").isLength({min: 3, max: 32}).notEmpty(),
    AuthController.passwordConfirm
);
authRouter.get("/activate/:link", AuthController.activate);

export default authRouter;
