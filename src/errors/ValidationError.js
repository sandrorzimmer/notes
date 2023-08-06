import BadRequest from './BadRequest.js';

class ValidationError extends BadRequest {
    constructor(error) {
        const errorMessages = Object.values(error.errors);
        errorMessages
            .map((err) => err.message)
            .join('; ');
        super(`The following errors were found: ${errorMessages}`);
    }
}

export default ValidationError;
