import { BACKEND_URL, NotificationDefinitions } from "./const.js";

import fetch from "node-fetch";

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

    async _callApi(path, method, payload = null) {
        try {
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
            };
            if (this.authorization) {
                headers.Authorization = this.authorization;
            }
            this._log("_callApi", method, `${this.backendUrl}${path}`);
            const fetchResponse = await fetch(`${this.backendUrl}${path}`, {
                method,
                headers,
                body: payload ? JSON.stringify(payload) : null,
            });

            const jsonResponse = await fetchResponse.json();

            if (jsonResponse.message == "Unauthorized") {
                throw new Error("Unauthorized");
            }

            return jsonResponse;
        } catch (error) {
            throw error;
        }
    }
}
