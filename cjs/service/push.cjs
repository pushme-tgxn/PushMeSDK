'use strict';

var _const = require('../const.cjs');

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

    longPollPushStatus(pushIdent) {
        return this.apiService._callApi(`/push/${pushIdent}/poll`, "GET", {}, { timeout: _const.POLLING_TIMEOUT });
    }
}

exports.default = PushService;
