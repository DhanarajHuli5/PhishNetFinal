import {validationResult} from "express-validator"
import {ApiError} from "../utils/api-error.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedError = []
    errors.array().map((err) => extractedError.push({
        [err.param]: err.msg
    }))
    console.log("------>",errors)
    throw new ApiError(422, "Recieved data is not valid", extractedError)

}
