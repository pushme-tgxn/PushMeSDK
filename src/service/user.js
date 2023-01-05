export default class UserService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    emailRegister(userEmail, userPassword) {
        return this.apiService._callApi("/auth/email/register", "POST", {
            email: userEmail,
            password: userPassword,
        });
    }

    updateEmail(userEmail) {
        return this.apiService._callApi("/auth/email/email", "POST", {
            email: userEmail,
        });
    }

    updatePassword(userPassword) {
        return this.apiService._callApi("/auth/email/password", "POST", {
            password: userPassword,
        });
    }

    async emailLogin(userEmail, userPassword) {
        const authResult = await this.apiService._callApi("/auth/email/login", "POST", {
            email: userEmail,
            password: userPassword,
        });

        if (authResult.success) {
            this.apiService.setAccessToken(authResult.user.token);
        }

        return authResult;
    }

    async authWithGoogle(idToken) {
        const authResult = await this.apiService._callApi("/auth/google/token", "POST", {
            idToken,
        });

        if (authResult.success) {
            this.apiService.setAccessToken(authResult.accessToken);
        }

        return authResult;
    }

    getCurrentUser() {
        return this.apiService._callApi("/user", "GET");
    }

    // deprecated!
    getPushHistory() {
        return this.apiService.push.history();
    }
    deleteSelf() {
        return this.apiService._callApi("/user", "DELETE");
    }
}
