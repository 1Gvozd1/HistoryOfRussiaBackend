import dotenv from "dotenv"
dotenv.config()
import express from "express"


//CORS
import cors from "cors"
import {corsOptions} from "./config/corsoptions.js";

//Database
import {sequelize} from "./config/database.js";
import models from "./database/model/index.js"

//Routes
import rootRouter from "./routes/index.js";

//Cookie
import cookieParser from "cookie-parser";

//Errors Handler
import exceptionHandle from "./middleware/exceptionMiddleware.js";

//INIT
import {Roles} from "./database/model/Roles.js";
import authService from "./service/auth/authService.js";
//

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/api", rootRouter)

app.use(exceptionHandle)

const init = async () => {
    await Roles.create({name: "USER"})
    await Roles.create({name: "MODER"})
    await Roles.create({name: "ADMIN"})
    await authService.register("MOLOT","eric01.01@mail.ru","eric01.01@mail.ru")
}

const start = async () => {
    try {
        await sequelize.authenticate();

        await sequelize.sync({force:process.env.DEV})
        init()
        app.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT))
    } catch (e) {
        console.log(e)
    }
}

start()