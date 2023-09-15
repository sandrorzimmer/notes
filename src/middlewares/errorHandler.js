import mongoose from 'mongoose';
import BadRequest from '../errors/BadRequest.js';
import BaseError from '../errors/BaseError.js';
import ValidationError from '../errors/ValidationError.js';
import logger from '../logs/logger.js';

function errorHandler(error, req, res, next) {
    logger.error(error);
    if (error instanceof mongoose.CastError) {
        new BadRequest().sendResponse(res);
    } else if (error instanceof mongoose.Error.ValidationError) {
        new ValidationError(error).sendResponse(res);
    } else if (error instanceof BaseError) {
        error.sendResponse(res);
    } else {
        new BaseError().sendResponse(res);
    }
}

export default errorHandler;
