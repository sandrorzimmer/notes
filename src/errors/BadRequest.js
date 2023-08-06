import BaseError from './BaseError.js';

class BadRequest extends BaseError {
    constructor(message = 'One or more provided data are incorrect') {
        super(message, 400);
    }
}

export default BadRequest;
