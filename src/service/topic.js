export default class TopicService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    list() {
        return this.apiService._callApi("/topic", "GET");
    }

    getById(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "GET");
    }

    create() {
        return this.apiService._callApi(`/topic`, "POST");
    }

    update(topicId, updateData) {
        return this.apiService._callApi(`/topic/${topicId}`, "POST", updateData);
    }

    delete(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "DELETE");
    }
}
