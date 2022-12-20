import { DEFAULT_TIMEOUT, BACKEND_URL, NotificationDefinitions } from "./const.js";

import axios from "axios";

import UserService from "./service/user.js";
import DeviceService from "./service/device.js";
import TopicService from "./service/topic.js";
import PushService from "./service/push.js";

export { BACKEND_URL, NotificationDefinitions };

export default class APIService {
    constructor(config) {
        this.authorization = null;
        this.backendUrl = BACKEND_URL;
        this.logger = false;

        this.user = new UserService(this);
        this.device = new DeviceService(this);
        this.topic = new TopicService(this);
        this.push = new PushService(this);

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

            if (jsonResponse.message == "Unauthorized") {
                throw new Error("Unauthorized");
            }

            return jsonResponse;
        } catch (error) {
            throw error;
        }
    }
}
