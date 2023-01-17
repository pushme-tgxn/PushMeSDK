import axios from "axios";

import { APIError, ServerError, UnauthorizedError } from "./errors.js";

import { DEFAULT_TIMEOUT, BACKEND_URL, DEFAULT_ACTION_IDENTIFIER, PushDefinition, PushCategory } from "./const.js";

import UserService from "./service/user.js";
import DeviceService from "./service/device.js";
import TopicService from "./service/topic.js";
import PushService from "./service/push.js";
import TrioService from "./service/trio.js";

class APIService {
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
        this.backendUrl = BACKEND_URL;
    }

    setBackendUrl(backendUrl) {
        this._log("setBackendUrl", backendUrl);
        this.backendUrl = backendUrl;
    }

    getNotificationCategory(categoryId) {
        if (!PushDefinition.hasOwnProperty(categoryId)) {
            return false;
        }

        return PushDefinition[categoryId];
    }

    getNotificationAction(categoryId, actionIdentifier) {
        const category = this.getNotificationCategory(categoryId);
        if (!category) {
            return false;
        }

        // no actions
        if (category.actions.length === 0) {
            return false;
        }

        const foundAction = category.actions.find((action) => action.identifier === actionIdentifier);
        if (!foundAction) {
            if (actionIdentifier === DEFAULT_ACTION_IDENTIFIER) {
                return {
                    identifier: "default",
                    title: "Default",
                };
            }

            return false;
        }

        return foundAction;
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

            const jsonResponse = fetchResponse.data;
            this._log("_apiResponse", jsonResponse);

            return jsonResponse;
        } catch (error) {
            // if there is a response
            if (error.response && error.response.status) {
                // if there is a unauthorized response (401)
                if (error.response && error.response.status && error.response.status === 401) {
                    this._log("_unauthorizedError", error.response.status, error.response.data.message);
                    throw new UnauthorizedError(
                        error.response.data.message,
                        error.response.data,
                        error.response.status
                    );
                }

                // if there is any other response error
                if (error.response && error.response.data && error.response.data.message) {
                    this._log("_serverError", error.response.status, error.response.data.message);
                    throw new ServerError(error.response.data.message, error.response.data, error.response.status);
                }

                this._log("_apiError", error.response.status);
                throw new APIError(error.message, error.response.data, error.response.status);
            } else {
                this._log("_apiError", error.message, error.code);
                throw new APIError(error.message, false, error.code);
            }
        }
    }
}

// Consts
export const Consts = {
    BACKEND_URL,
    DEFAULT_ACTION_IDENTIFIER,
    PushDefinition,
    PushCategory,
};

// Errors
export const Errors = {
    APIError,
    ServerError,
    UnauthorizedError,
};

export default APIService;
