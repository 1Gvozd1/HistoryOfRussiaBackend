import {ApiError} from "../exceptions/apiError.js";

export default function (err, req, res, next) {
    if (err instanceof ApiError) {
        console.log(err.message)
        return res.status(err.status).json({message: err.message, errors: err.errors})

    }
    console.log(err.message)
    return res.status(500).json({message: "Непредвиденная ошибка!"})
}
