'use strict';

class DeviceService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    list() {
        return this.apiService._callApi("/device", "GET");
    }

    getById(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "GET");
    }

    create(deviceData) {
        return this.apiService._callApi("/device/create", "POST", deviceData);
    }

    update(deviceKey, updateData) {
        return this.apiService._callApi(`/device/${deviceKey}`, "POST", updateData);
    }

    delete(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "DELETE");
    }

    testDevice(deviceKey) {
        return this.apiService._callApi(`/device/${deviceKey}/test`, "POST");
    }
}

exports.default = DeviceService;
