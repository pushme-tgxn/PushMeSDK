'use strict';

var _const = require('./const.cjs');
var axios = require('axios');
var errors = require('./errors.cjs');
var user = require('./service/user.cjs');
var device = require('./service/device.cjs');
var topic = require('./service/topic.cjs');
var push = require('./service/push.cjs');
var trio = require('./service/trio.cjs');

class APIService {
    constructor(config) {
        this.authorization = null;
        this.backendUrl = _const.BACKEND_URL;
        this.logger = false;

        this.user = new user.default(this);
        this.device = new device.default(this);
        this.topic = new topic.default(this);
        this.push = new push.default(this);

        // "Trio" to avoid *confusion* with another well-known company
        this.trio = new trio.default(this);

        // if config is specified
        if (config) {
            if (config.backendUrl) {
                this.setBackendUrl(config.backendUrl);
            }

            if (config.accessToken) {
                this.setAccessToken(config.accessToken);
            }

            if (config.logging) {
                this.logger = config.logging;

                // allow setting to true to log it
                if (config.logging === true) {
                    this.logger = this._log;
                }
            }
        }
    }

    _log(...args) {
        if (this.logger) {
            this.logger(...args);
        }
    }

    getBackendUrl() {
        return this.backendUrl;
    }

    resetBackend() {
        this.backendUrl = _const.BACKEND_URL;
    }

    setBackendUrl(backendUrl) {
        this._log("setBackendUrl", backendUrl);
        this.backendUrl = backendUrl;
    }

    setAccessToken(accessToken) {
        this._log("setAccessToken", accessToken);
        this.accessToken = accessToken;
        this.authorization = `Bearer ${accessToken}`;
    }

    async _callApi(path, method, payload = null, config = null) {
        try {
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
            };

            if (this.authorization) {
                headers.Authorization = this.authorization;
            }

            const axiosConfig = {
                method,
                headers,
                responseType: "json",
                timeout: _const.DEFAULT_TIMEOUT,
                ...config,
            };

            if (payload && method !== "GET") {
                axiosConfig.data = payload;
            }

            this._log("_callApi", method, `${this.backendUrl}${path}`, payload);
            const fetchResponse = await axios(`${this.backendUrl}${path}`, axiosConfig);
            this._log("_apiResponse", fetchResponse.data);

            const jsonResponse = fetchResponse.data;
            console.log("jsonResponse", jsonResponse);

            return jsonResponse;
        } catch (error) {
            // if there is a response
            if (error.response && error.response.status) {
                // if there is a unauthorized response (401)
                if (error.response && error.response.status && error.response.status === 401) {
                    this._log("_unauthorizedError", error.response.status, error.response.data.message);
                    throw new errors.UnauthorizedError(
                        error.response.data.message,
                        error.response.data,
                        error.response.status
                    );
                }

                // if there is any other response error
                if (error.response && error.response.data && error.response.data.message) {
                    this._log("_serverError", error.response.status, error.response.data.message);
                    throw new errors.ServerError(error.response.data.message, error.response.data, error.response.status);
                }

                this._log("_apiError", error.response.status);
                throw new errors.APIError(error.message, error.response.data, error.response.status);
            } else {
                this._log("_apiError", error.message, error.code);
                throw new errors.APIError(error.message, false, error.code);
            }
        }
    }
}

exports.BACKEND_URL = _const.BACKEND_URL;
exports.NotificationDefinitions = _const.NotificationDefinitions;
exports.APIError = errors.APIError;
exports.ServerError = errors.ServerError;
exports.UnauthorizedError = errors.UnauthorizedError;
exports.default = APIService;
