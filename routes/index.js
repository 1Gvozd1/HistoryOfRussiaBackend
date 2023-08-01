import {Router} from "express";
import authRouter from "./authRouter.js";

const rootRouter = new Router();


rootRouter.use("/auth", authRouter)

// requiredRole("ADMIN")

export default rootRouter;

