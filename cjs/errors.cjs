'use strict';

// error calling server / in axios
class APIError extends Error {
    constructor(message, response, code) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }

        this.name = "APIError";
        this.message = message;
        this.date = new Date();

        // attach axios error info
        this.body = response; // response data
        this.code = code; // status code
    }
}

// error originating from server "success: false"
class ServerError extends Error {
    constructor(message, response, code) {
        super(message);

        this.name = "ServerError";
        this.message = message;
        this.date = new Date();

        // attach server response info
        this.body = response;
        this.code = code;
    }
}

// error originating from server unauthorized
class UnauthorizedError extends Error {
    constructor(message, response, code) {
        super(message);

        this.name = "UnauthorizedError";
        this.message = message;
        this.date = new Date();

        // attach server response info
        this.body = response;
        this.code = code;
    }
}

exports.APIError = APIError;
exports.ServerError = ServerError;
exports.UnauthorizedError = UnauthorizedError;
