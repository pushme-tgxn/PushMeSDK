import { BACKEND_URL } from "./const";

class UserService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    emailLogin(userEmail, userPassword) {
        return this.apiService._callApi("/auth/email/login", "POST", {
            email: userEmail,
            password: userPassword,
        });
    }
    emailRegister(userEmail, userPassword) {
        return this.apiService._callApi("/auth/email/register", "POST", {
            email: userEmail,
            password: userPassword,
        });
    }

    authWithGoogle(idToken) {
        return this.apiService._callApi("/auth/google/token", "POST", {
            idToken,
        });
    }

    getCurrentUser() {
        return this.apiService._callApi("/user", "GET");
    }

    getPushHistory() {
        return this.apiService._callApi("/user/history", "GET");
    }

    deleteSelf() {
        return this.apiService._callApi("/user", "DELETE");
    }
}

class DeviceService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    getList() {
        return this.apiService._callApi("/device", "GET");
    }

    getDevice(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "GET");
    }

    createDevice(deviceData) {
        return this.apiService._callApi("/device/create", "POST", deviceData);
    }

    upsertDevice(deviceKey, deviceData) {
        return this.apiService._callApi(`/device/${deviceKey}`, "POST", deviceData);
    }

    deleteDevice(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "DELETE");
    }

    testDevice(deviceKey) {
        return this.apiService._callApi(`/device/${deviceKey}/test`, "POST");
    }
}

class TopicService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    getList() {
        return this.apiService._callApi("/topic", "GET");
    }

    getTopic(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "GET");
    }

    create(tokenId) {
        return this.apiService._callApi(`/topic`, "POST", { tokenId });
    }

    update(topicId, updateData) {
        return this.apiService._callApi(`/topic/${topicId}`, "POST", updateData);
    }

    delete(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "DELETE");
    }
}

class PushService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    pushToTopic(topicSecret, { categoryId, title, body, data }) {
        return this.apiService._callApi(`/push/${topicSecret}`, "POST", {
            categoryId,
            title,
            body,
            data,
        });
    }

    respondToPush(pushIdent, response) {
        return this.apiService._callApi(`/push/${pushIdent}/response`, "POST", response);
    }

    getPushStatus(pushIdent) {
        return this.apiService._callApi(`/push/${pushIdent}/status`, "GET");
    }
}

class APIService {
    constructor() {
        this.authorization = null;

        this.user = new UserService(this);
        this.device = new DeviceService(this);
        this.topic = new TopicService(this);
        this.push = new PushService(this);

        this.backendUrl = BACKEND_URL;
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
        console.log("setBackendUrl", backendUrl);
        this.backendUrl = backendUrl;
    }

    setAccessToken(accessToken) {
        console.log("setAccessToken", accessToken);
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
            console.log("_callApi", method, `${this.backendUrl}${path}`);
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

const apiService = new APIService();
export default apiService;
