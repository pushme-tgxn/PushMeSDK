import { expect } from "chai";

import { faker } from "@faker-js/faker"; // https://www.npmjs.com/package/@faker-js/faker

import PushMeSDK, { Consts, Errors } from "../src/index.js";

const errorMessages = {
    emailpasswordIncorrect: "email or password is incorrect",
    passwordIsRequired: "password is required",
    emailIsRequired: "email is required",
    emailMethodNotFound: "email method not found",
    emailAlreadyRegistered: "email already registered",
    emailNotChanged: "email not changed",
    userNotFound: "user not found",
};

describe("PushMeSDK", function () {
    let pushMeInstance;

    // so we can get lots of instances with the same backend
    const testBackendUrl = process.env.TEST_BACKEND || "http://localhost:3000";
    const getNewInstance = (config) => {
        return new PushMeSDK({
            backendUrl: testBackendUrl,
            ...config,
        });
    };

    describe("API Class", function () {
        const defaultBackendUrl = "https://pushme.tgxn.net";

        it("check default config", async () => {
            expect(Consts.BACKEND_URL).to.exist.and.equal(defaultBackendUrl);
        });

        it("setup instance with logger", async () => {
            const testInstance = getNewInstance({
                logging: console.log,
            });

            expect(testInstance.backendUrl).to.exist.and.equal(testBackendUrl);
        });

        it("setup instance", async () => {
            pushMeInstance = getNewInstance();

            expect(pushMeInstance.backendUrl).to.exist.and.equal(testBackendUrl);
        });

        it("check PushCategory", async () => {
            const { BUTTON_YES_NO, BUTTON_OPEN_LINK } = Consts.PushCategory;

            expect(BUTTON_YES_NO).to.exist.and.equal("button.yes_no");
            expect(BUTTON_OPEN_LINK).to.exist.and.equal("button.open_link");
        });

        it("check getNotificationCategory", async () => {
            const foundCategory = pushMeInstance.getNotificationCategory("button.open_link");

            expect(foundCategory.title).to.exist.and.equal("Open Link");
            expect(foundCategory.sendDefaultAction).to.exist.and.equal(true);
        });

        it("BAD: check getNotificationCategory", async () => {
            const foundCategory = pushMeInstance.getNotificationCategory("fake.action");

            expect(foundCategory).to.exist.and.equal(false);
        });

        it("check getNotificationAction", async () => {
            const foundAction = pushMeInstance.getNotificationAction("button.open_link", "open_link");

            expect(foundAction.title).to.exist.and.equal("Open Link");
            expect(foundAction.identifier).to.exist.and.equal("open_link");
        });

        it("check getNotificationAction DEFAULT_ACTION_IDENTIFIER", async () => {
            const foundAction = pushMeInstance.getNotificationAction(
                "button.open_link",
                Consts.DEFAULT_ACTION_IDENTIFIER
            );

            expect(foundAction.title).to.exist.and.equal("Default");
            expect(foundAction.identifier).to.exist.and.equal("default");
        });

        it("check getNotificationAction DEFAULT_ACTION_IDENTIFIER no actions", async () => {
            const foundAction = pushMeInstance.getNotificationAction("simple.push", Consts.DEFAULT_ACTION_IDENTIFIER);

            expect(foundAction.title).to.exist.and.equal("Default");
            expect(foundAction.identifier).to.exist.and.equal("default");
        });

        it("BAD: check getNotificationAction", async () => {
            const foundAction = pushMeInstance.getNotificationAction("button.open_link", "fake-action");

            expect(foundAction).to.exist.and.equal(false);
        });

        it("BAD: check getNotificationAction", async () => {
            const foundAction = pushMeInstance.getNotificationAction("simple.push", "fake-action");

            expect(foundAction).to.exist.and.equal(false);
        });

        // axios returns non-200 / network
        it("error: APIError 404 not found // includes code and message on error", async () => {
            try {
                const result = await pushMeInstance._callApi(`/fakepath`, "GET");
                expect(result).to.not.exist;
            } catch (error) {
                expect(error instanceof Errors.APIError).to.be.true;

                expect(error.code).to.exist.and.equal(404);
                expect(error.message).to.exist.and.equal("Request failed with status code 404");
            }
        });

        // custom error is thrown for 401 unauthorized
        it("error: UnauthorizedError unauthorized error // includes server response", async () => {
            try {
                const result = await pushMeInstance.user.getCurrentUser();
                expect(result).to.not.exist;
            } catch (error) {
                expect(error instanceof Errors.UnauthorizedError).to.be.true;

                expect(error.code).to.exist.and.equal(401);
                expect(error.message).to.exist.and.equal("unauthorized");
            }
        });
    });

    describe("User Service", function () {
        let testUserId, testUserToken;

        const emailAddress = faker.internet.email();
        const password = faker.internet.password();

        const newEmailAddress = faker.internet.email();
        const newPassword = faker.internet.password();

        it("can register", async () => {
            const result = await pushMeInstance.user.emailRegister(emailAddress, password);

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
            expect(result.user.id).to.exist;

            testUserId = result.user.id;
        });

        it("can login", async () => {
            const result = await pushMeInstance.user.emailLogin(emailAddress, password);

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
            expect(result.user.token).to.exist;

            // save the given user token
            testUserToken = result.user.token;
        });

        it("can get user details", async () => {
            const result = await pushMeInstance.user.getCurrentUser();

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
            expect(result.methods).to.exist;
            expect(result.methods[0].method).to.exist.and.equal("email");
            expect(result.methods[0].methodIdent).to.exist.and.equal(emailAddress);
        });

        it("can update email", async () => {
            const result = await pushMeInstance.user.updateEmail(newEmailAddress);

            expect(result.success).to.exist.and.equal(true);
            expect(result.userId).to.exist.and.equal(testUserId);
        });
        it("error: ServerError can't update invalid email", async () => {
            try {
                const result = await pushMeInstance.user.updateEmail("");
                expect(result).to.not.exist;
            } catch (error) {
                expect(error instanceof Errors.ServerError).to.be.true;

                expect(error.code).to.exist.and.equal(400);
                expect(error.message).to.exist.and.equal(errorMessages.emailIsRequired);
            }
        });

        it("can update password", async () => {
            const result = await pushMeInstance.user.updatePassword(newPassword);

            expect(result.success).to.exist.and.equal(true);
            expect(result.userId).to.exist.and.equal(testUserId);
        });
        it("error: ServerError can't update invalid password", async () => {
            try {
                const result = await pushMeInstance.user.updatePassword("");
                expect(result).to.not.exist;
            } catch (error) {
                expect(error instanceof Errors.ServerError).to.be.true;

                expect(error.code).to.exist.and.equal(400);
                expect(error.message).to.exist.and.equal(errorMessages.passwordIsRequired);
            }
        });

        it("can get new user details", async () => {
            const result = await pushMeInstance.user.getCurrentUser();

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
            expect(result.methods).to.exist;
            expect(result.methods[0].method).to.exist.and.equal("email");
            expect(result.methods[0].methodIdent).to.exist.and.equal(newEmailAddress);
        });

        it("DEPRECATED: can get user push history", async () => {
            const result = await pushMeInstance.user.getPushHistory();

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushes).to.exist;
            expect(result.pushes.length).to.exist.and.equal(0);
        });

        // create a user that we will then immediately delete
        const testInstance = getNewInstance();
        let deleteTestUserToken;
        it("can get and login with user to delete", async () => {
            const registerResult = await testInstance.user.emailRegister(emailAddress, password);
            const loginResult = await testInstance.user.emailLogin(emailAddress, password);

            deleteTestUserToken = loginResult.user.token;

            expect(registerResult.success).to.exist.and.equal(true);
            expect(registerResult.user).to.exist;
            expect(registerResult.user.id).to.exist;

            expect(loginResult.success).to.exist.and.equal(true);
            expect(loginResult.user).to.exist;
            expect(loginResult.user.token).to.exist;
        });

        // test getting a new instance of the client with a provided access token
        let finalInstance;
        it("can get instance with provided access token", async () => {
            finalInstance = getNewInstance({
                accessToken: deleteTestUserToken,
            });

            expect(finalInstance.authorization).to.exist.and.equal(`Bearer ${deleteTestUserToken}`);
        });

        it("can delete user", async () => {
            const result = await finalInstance.user.deleteSelf();

            expect(result.success).to.exist.and.equal(true);
        });

        // try to use the deleted user's token
        it("error: UnauthorizedError invalid user in signed token error", async () => {
            // custom error is thrown for 401 invalid user
            try {
                const result = await testInstance.user.getCurrentUser();
                expect(result).to.not.exist;
            } catch (error) {
                expect(error instanceof Errors.UnauthorizedError).to.be.true;

                expect(error.code).to.exist.and.equal(401);
                expect(error.message).to.exist.and.equal("unauthorized");
            }
        });
    });

    let createdDeviceId;
    describe("Device Service", function () {
        const fakeDeviceKey = faker.datatype.uuid();
        const fakeExpoToken = `ExponentPushToken[${faker.lorem.slug()}]`;
        const fakeNativeToken = {
            type: "android",
            data: faker.datatype.uuid(),
        };

        it("can create device", async () => {
            const result = await pushMeInstance.device.create({
                deviceKey: fakeDeviceKey,
                token: fakeExpoToken,
                nativeToken: fakeNativeToken,
                type: "ios",
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.device).to.exist;
            expect(result.device.id).to.exist;
            expect(result.device.deviceKey).to.exist.and.equal(fakeDeviceKey);
            expect(result.device.token).to.exist.and.equal(fakeExpoToken);
            expect(result.device.nativeToken).to.exist.and.equal(JSON.stringify(fakeNativeToken));
            expect(result.device.type).to.exist.and.equal("ios");

            createdDeviceId = result.device.id;
        });

        it("can list devices", async () => {
            const result = await pushMeInstance.device.list();

            expect(result.success).to.exist.and.equal(true);
            expect(result.devices).to.exist;
            expect(result.devices.length).to.exist.and.equal(1);
            expect(result.devices[0].deviceKey).to.exist.and.equal(fakeDeviceKey);
        });

        it("can update device", async () => {
            const result = await pushMeInstance.device.update(fakeDeviceKey, {
                name: "Test Device",
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.device).to.exist;
        });

        it("can get device details", async () => {
            const result = await pushMeInstance.device.getById(createdDeviceId);

            expect(result.success).to.exist.and.equal(true);
            expect(result.device).to.exist;
            expect(result.device.id).to.exist;
            expect(result.device.name).to.exist.and.equal("Test Device");
            expect(result.device.deviceKey).to.exist.and.equal(fakeDeviceKey);
            expect(result.device.token).to.exist.and.equal(fakeExpoToken);
            expect(result.device.nativeToken).to.exist.and.equal(JSON.stringify(fakeNativeToken));
        });
    });

    let topicId, topicKey, topicSecret;
    describe("Topic Service", function () {
        it("can create topic", async () => {
            const result = await pushMeInstance.topic.create({
                deviceIds: [createdDeviceId],
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist;
            expect(result.topic.topicKey).to.exist;
            expect(result.topic.secretKey).to.exist;

            topicId = result.topic.id;
            topicKey = result.topic.topicKey;
            topicSecret = result.topic.secretKey;
        });

        it("can get topic details", async () => {
            const result = await pushMeInstance.topic.getById(topicId);

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist.and.equal(topicId);
            expect(result.topic.topicKey).to.exist.and.equal(topicKey);
            expect(result.topic.secretKey).to.exist.and.equal(topicSecret);
        });

        it("can get all topics", async () => {
            const result = await pushMeInstance.topic.list();

            expect(result.success).to.exist.and.equal(true);
            expect(result.topics).to.exist;
            expect(result.topics.length).to.exist.and.equal(1);
            expect(result.topics[0].topicKey).to.exist.and.equal(topicKey);
            expect(result.topics[0].secretKey).to.exist.and.equal(topicSecret);
        });

        it("can update topic", async () => {
            const result = await pushMeInstance.topic.update(topicId, {
                name: "Test Topic",
                deviceIds: [createdDeviceId],
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist.and.equal(topicId);
            expect(result.topic.topicKey).to.exist.and.equal(topicKey);
            expect(result.topic.secretKey).to.exist.and.equal(topicSecret);

            expect(result.topic.name).to.exist.and.equal("Test Topic");
        });
    });

    describe("Push Service", function () {
        let sentPushIdent;

        let testPushCategoryId, testPushCategory, testActionIdent;

        it("get test notification category and action", async () => {
            testPushCategoryId = "button.approve_deny";
            testPushCategory = pushMeInstance.getNotificationCategory(testPushCategoryId);
            testActionIdent = testPushCategory.actions[0].identifier;
        });

        it("can get push history", async () => {
            const result = await pushMeInstance.push.history();

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushes).to.exist;
            expect(result.pushes.length).to.exist.and.equal(0);
        });

        // pushing and responses shoudl be available without authentication
        const unauthenticatedInstance = getNewInstance();

        it("sends a push", async () => {
            const result = await unauthenticatedInstance.push.pushToTopic(topicSecret, {
                categoryId: testPushCategoryId,
                title: "Test Push",
                body: "This is a test push",
                data: {
                    test: "data",
                },
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushIdent).to.exist;

            sentPushIdent = result.pushIdent;
        });

        it("can get push details", async () => {
            const result = await unauthenticatedInstance.push.getPushStatus(sentPushIdent);

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushPayload).to.exist;
            expect(result.pushPayload.categoryId).to.exist.and.equal(testPushCategoryId);
            expect(result.pushPayload.title).to.exist.and.equal("Test Push");
            expect(result.pushPayload.body).to.exist.and.equal("This is a test push");
        });

        it("can send recieved receipt", async () => {
            const result = await unauthenticatedInstance.push.sendReceipt(sentPushIdent, {
                recieved: "true", // mock event, normal event would be the notification
            });

            expect(result.success).to.exist.and.equal(true);
        });

        it("can respond to push", async () => {
            const result = await unauthenticatedInstance.push.respondToPush(sentPushIdent, {
                // pushIdent: sentPushIdent,
                // pushId: response.notification.request.content.data.pushId,
                categoryIdentifier: testPushCategoryId, // catgry of notification
                actionIdentifier: testActionIdent, // action that was taken
                responseText: "hello", // extra text
            });

            expect(result.success).to.exist.and.equal(true);
            // expect(result.pushPayload).to.exist;
        });

        it("can get updated push details (firstValidResponse & pushReceipt)", async () => {
            const result = await unauthenticatedInstance.push.getPushStatus(sentPushIdent);

            console.log(result);

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushPayload).to.exist;
            expect(result.firstValidResponse.categoryIdentifier).to.exist.and.equal(testPushCategoryId);
            expect(result.firstValidResponse.actionIdentifier).to.exist.and.equal(testActionIdent);
            expect(result.firstValidResponse.responseText).to.exist.and.equal("hello");
        });
    });

    describe("Trio Push Service", function () {
        // pushing and responses shoudl be available without authentication
        const unauthenticatedInstance = getNewInstance();

        it("can ping service", async () => {
            const result = await unauthenticatedInstance.trio.ping();

            expect(result.stat).to.exist.and.equal("OK");
            expect(result.response.time).to.exist;

            // this will allow authentication with secret instead of signature
            expect(result.response.validation).to.exist.and.equal("skipped");
        });

        let authDeviceIdent;
        it("can preauth (get device ident)", async () => {
            const result = await unauthenticatedInstance.trio.preAuth(topicKey, topicSecret);

            expect(result.stat).to.exist.and.equal("OK");
            expect(result.response.devices).to.exist;
            expect(result.response.devices[0].device).to.exist;

            authDeviceIdent = result.response.devices[0].device;
        });

        // wait for timeout
        it("can auth", async () => {
            const result = await unauthenticatedInstance.trio.auth(topicKey, topicSecret, authDeviceIdent);

            expect(result.stat).to.exist.and.equal("OK");

            expect(result.response.result).to.exist.and.equal("deny");
            expect(result.serviceData.actionIdentifier).to.exist.and.equal("noresponse");
        }).timeout(35000);
    });
});
