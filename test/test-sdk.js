import { expect } from "chai";

import { faker } from "@faker-js/faker"; // https://www.npmjs.com/package/@faker-js/faker

import PushMe, { BACKEND_URL } from "../src/index.js";

describe("PushMeSDK", () => {
    let pushMeInstance;

    // so we can get lots of instances with the same backend
    const testBackendUrl = process.env.TEST_BACKEND || "http://localhost:3000";
    const getNewInstance = (config) => {
        return new PushMe({
            ...config,
            backendUrl: testBackendUrl,
        });
    };

    describe("API Class", () => {
        const defaultBackendUrl = "https://pushme.tgxn.net";

        it("check default config", async () => {
            expect(BACKEND_URL).to.exist.and.equal(defaultBackendUrl);
        });

        it("setup instance", async () => {
            pushMeInstance = getNewInstance();

            expect(pushMeInstance.backendUrl).to.exist.and.equal(testBackendUrl);
        });
    });

    describe("User Service", () => {
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

        it("can update password", async () => {
            const result = await pushMeInstance.user.updatePassword(newPassword);

            expect(result.success).to.exist.and.equal(true);
            expect(result.userId).to.exist.and.equal(testUserId);
        });

        it("can get new user details", async () => {
            const result = await pushMeInstance.user.getCurrentUser();

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
            expect(result.methods).to.exist;
            expect(result.methods[0].method).to.exist.and.equal("email");
            expect(result.methods[0].methodIdent).to.exist.and.equal(newEmailAddress);
        });

        it("can get user push history", async () => {
            const result = await pushMeInstance.user.getPushHistory();

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushes).to.exist;
            expect(result.pushes.length).to.exist.and.equal(0);
        });
    });

    let createdDeviceId;
    describe("Device Service", () => {
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
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.device).to.exist;
            expect(result.device.id).to.exist;
            expect(result.device.deviceKey).to.exist.and.equal(fakeDeviceKey);
            expect(result.device.token).to.exist.and.equal(fakeExpoToken);
            expect(result.device.nativeToken).to.exist.and.equal(JSON.stringify(fakeNativeToken));

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
    describe("Topic Service", () => {
        it("can create topic", async () => {
            const result = await pushMeInstance.topic.create({
                deviceIds: [createdDeviceId],
            });

            console.log(result);

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

            console.log(result);

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist.and.equal(topicId);
            expect(result.topic.topicKey).to.exist.and.equal(topicKey);
            expect(result.topic.secretKey).to.exist.and.equal(topicSecret);

            expect(result.topic.name).to.exist.and.equal("Test Topic");
        });
    });

    describe("Push Service", () => {
        let sentPushIdent;

        // pushing and responses shoudl be available without authentication
        const unauthenticatedInstance = getNewInstance();

        it("sends a push", async () => {
            const result = await unauthenticatedInstance.push.pushToTopic(topicSecret, {
                categoryId: "default",
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
            expect(result.pushData).to.exist;
            expect(result.pushData.categoryId).to.exist.and.equal("default");
            expect(result.pushData.title).to.exist.and.equal("Test Push");
            expect(result.pushData.body).to.exist.and.equal("This is a test push");
        });

        it("can respond to push", async () => {
            const result = await unauthenticatedInstance.push.respondToPush(sentPushIdent, {
                // pushIdent: sentPushIdent,
                // pushId: response.notification.request.content.data.pushId,
                categoryIdentifier: "button.submit", // catgry of notification
                actionIdentifier: "submit", // action that was taken
                responseText: "hello", // extra text
            });

            expect(result.success).to.exist.and.equal(true);
            // expect(result.pushData).to.exist;
        });

        it("can get push details", async () => {
            const result = await unauthenticatedInstance.push.getPushStatus(sentPushIdent);

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushData).to.exist;
            expect(result.firstValidResponse.categoryIdentifier).to.exist.and.equal("button.submit");
            expect(result.firstValidResponse.actionIdentifier).to.exist.and.equal("submit");
            expect(result.firstValidResponse.responseText).to.exist.and.equal("hello");
        });
    });
});
