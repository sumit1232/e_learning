import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    //Wrong mongodb id Error
    if (err.name === 'CastError') {
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate Key Error
    if (err.code === 11000) {
        const message = `Resource already exists, Duplicate: ${err.keyValue}`;
        err = new ErrorHandler(message, 400);

    }

    //Wrong JWT Token Error
    if (err.name === 'JWTWebTokenError') {
        const message = `Json web token is Invalid, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //JWT expired error message
    if (err.name === 'TokenExpiredError') {
        const message = `JSON Web Token expired,Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}