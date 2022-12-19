import { expect } from "chai";

import { faker } from "@faker-js/faker"; // https://www.npmjs.com/package/@faker-js/faker

import PushMe, { BACKEND_URL } from "../src/index.js";

describe("PushMeSDK", () => {
    let pushMeInstance, testUserToken;

    describe("Class", () => {
        const defaultBackendUrl = "https://pushme.tgxn.net";
        const testBackendUrl = "http://localhost:3000";

        it("check default config", async () => {
            expect(BACKEND_URL).to.exist.and.equal(defaultBackendUrl);
        });

        it("setup instance", async () => {
            pushMeInstance = new PushMe({
                backendUrl: testBackendUrl,
                // accessToken: "", // if saved
            });
            expect(pushMeInstance.backendUrl).to.exist.and.equal(testBackendUrl);
        });
    });

    describe("UserService", () => {
        const emailAddress = faker.internet.email();
        const password = faker.internet.password();

        const newEmailAddress = faker.internet.email();
        const newPassword = faker.internet.password();

        it("can register", async () => {
            const result = await pushMeInstance.user.emailRegister(emailAddress, password);

            expect(result.success).to.exist.and.equal(true);
            expect(result.user).to.exist;
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

        it("can get user push history", async () => {
            const result = await pushMeInstance.user.getPushHistory();

            expect(result.success).to.exist.and.equal(true);
            expect(result.pushes).to.exist;
            expect(result.pushes.length).to.exist.and.equal(0);
        });
    });

    describe("TopicService", () => {
        let topicId, topicKey, topicSecret;

        it("can create topic", async () => {
            const result = await pushMeInstance.topic.create();

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
            const result = await pushMeInstance.topic.getTopic(topicId);

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist.and.equal(topicId);
            expect(result.topic.topicKey).to.exist.and.equal(topicKey);
            expect(result.topic.secretKey).to.exist.and.equal(topicSecret);
        });

        it("can get all topics", async () => {
            const result = await pushMeInstance.topic.getList();

            expect(result.success).to.exist.and.equal(true);
            expect(result.topics).to.exist;
            expect(result.topics.length).to.exist.and.equal(1);
            expect(result.topics[0].topicKey).to.exist.and.equal(topicKey);
            expect(result.topics[0].secretKey).to.exist.and.equal(topicSecret);
        });

        it("can update topic", async () => {
            const result = await pushMeInstance.topic.update(topicId, {
                name: "Test Topic",
            });

            expect(result.success).to.exist.and.equal(true);
            expect(result.topic).to.exist;
            expect(result.topic.id).to.exist.and.equal(topicId);
            expect(result.topic.topicKey).to.exist.and.equal(topicKey);
            expect(result.topic.secretKey).to.exist.and.equal(topicSecret);

            expect(result.topic.name).to.exist.and.equal("Test Topic");
        });
    });

    describe("DeviceService", () => {
        const fakeDeviceKey = faker.datatype.uuid();
        const fakeExpoToken = `ExponentPushToken[${faker.lorem.slug()}]`;
        const fakeNativeToken = {
            type: "android",
            data: faker.datatype.uuid(),
        };

        let createdDeviceId;

        it("can create device", async () => {
            const result = await pushMeInstance.device.create({
                deviceKey: fakeDeviceKey,
                // name: fakeDeviceKey,
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
            const result = await pushMeInstance.device.get(createdDeviceId);

            expect(result.success).to.exist.and.equal(true);
            expect(result.device).to.exist;
            expect(result.device.id).to.exist;
            expect(result.device.name).to.exist.and.equal("Test Device");
            expect(result.device.deviceKey).to.exist.and.equal(fakeDeviceKey);
            expect(result.device.token).to.exist.and.equal(fakeExpoToken);
            expect(result.device.nativeToken).to.exist.and.equal(JSON.stringify(fakeNativeToken));
        });
    });
});
