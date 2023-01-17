import { POLLING_TIMEOUT } from "../const.js";

export default class PushService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    history() {
        return this.apiService._callApi("/push", "GET");
    }

    pushToTopic(topicSecret, { categoryId, title, body, data }) {
        return this.apiService._callApi(`/push/${topicSecret}`, "POST", {
            categoryId,
            title,
            body,
            data,
        });
    }

    sendReceipt(pushIdent, receiptContent) {
        return this.apiService._callApi(`/push/${pushIdent}/receipt`, "POST", receiptContent);
    }

    respondToPush(pushIdent, response) {
        return this.apiService._callApi(`/push/${pushIdent}/response`, "POST", response);
    }

    getPushStatus(pushIdent) {
        return this.apiService._callApi(`/push/${pushIdent}/status`, "GET");
    }

    longPollPushStatus(pushIdent) {
        return this.apiService._callApi(`/push/${pushIdent}/poll`, "GET", {}, { timeout: POLLING_TIMEOUT });
    }
}
