'use strict';

var _const = require('../const.cjs');

class TrioService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    ping() {
        return this.apiService._callApi(`/auth/v2/ping`, "GET");
    }

    preAuth(topicKey, topicSecret) {
        return this.apiService._callApi(
            `/auth/v2/preauth`,
            "POST",
            {
                username: "test",
            },
            {
                auth: {
                    username: topicKey,
                    password: topicSecret,
                },
            }
        );
    }

    auth(topicKey, topicSecret, deviceKey) {
        return this.apiService._callApi(
            `/auth/v2/auth`,
            "POST",
            {
                device: deviceKey,
                username: "tgxn",
            },
            {
                timeout: _const.POLLING_TIMEOUT,
                auth: {
                    username: topicKey,
                    password: topicSecret,
                },
            }
        );
    }

    // TODO implement this and txid server side
    // authStatus(topicKey, topicSecret, deviceKey) {
    //     return this.apiService._callApi(
    //         `/auth/v2/auth`,
    //         "POST",
    //         {
    //             device: deviceKey,
    //             username: "tgxn",
    //         },
    //         {
    //             timeout: POLLING_TIMEOUT,
    //             auth: {
    //                 username: topicKey,
    //                 password: topicSecret,
    //             },
    //         }
    //     );
    // }
}

exports.default = TrioService;
