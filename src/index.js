import { DEFAULT_TIMEOUT, BACKEND_URL, NotificationDefinitions } from "./const.js";

import axios from "axios";

import UserService from "./service/user.js";
import DeviceService from "./service/device.js";
import TopicService from "./service/topic.js";
import PushService from "./service/push.js";
import TrioService from "./service/trio.js";

export { BACKEND_URL, NotificationDefinitions };

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

export default class APIService {
    constructor(config) {
        this.authorization = null;
        this.backendUrl = BACKEND_URL;
        this.logger = false;

        this.user = new UserService(this);
        this.device = new DeviceService(this);
        this.topic = new TopicService(this);
        this.push = new PushService(this);

        // "Trio" to avoid *confusion* with another well-known company
        this.trio = new TrioService(this);

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

    _log(...args) {
        if (this.logger) {
            this.logger(...args);
        }
    }

    getBackendUrl() {
        return this.backendUrl;
    }

    isDefaultBackend() {
        return this.backendUrl === BACKEND_URL;
    }

    resetBackend() {
        this.backendUrl = BACKEND_URL;
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
                timeout: DEFAULT_TIMEOUT,
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

            if (jsonResponse.success == false) {
                this._log("_serverError", jsonResponse);
                throw new ServerError(jsonResponse.message, jsonResponse, fetchResponse.status);
            }

            return jsonResponse;
        } catch (error) {
            // re-throw server errors
            if (error instanceof ServerError) {
                throw error;
            }

            // if there is a server error response (non-200)
            if (error.response && error.response.data && error.response.data.message) {
                this._log("_serverError_global", error.response.status, error.response.data.message);
                throw new ServerError(error.response.data.message, error.response.data, error.response.status);
            }

            this._log("_apiError", error.response.status);
            throw new APIError(error.message, error.response.data, error.response.status);
        }
    }
}
