export default class DeviceService {
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

    update(deviceKey, deviceData) {
        return this.apiService._callApi(`/device/${deviceKey}`, "POST", deviceData);
    }

    delete(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "DELETE");
    }
}
