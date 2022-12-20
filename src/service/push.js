import { POLLING_TIMEOUT } from "../const.js";

export default class PushService {
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

    longPollPushStatus(pushIdent) {
        return this.apiService._callApi(`/push/${pushIdent}/status`, "GET", {}, { timeout: POLLING_TIMEOUT });
    }
}
