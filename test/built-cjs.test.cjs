const expect = require("chai").expect;

const PushMeSDK = require("../dist/commonjs-node/index.js").default;

const Consts = require("../dist/commonjs-node/index.js").Consts;
const Errors = require("../dist/commonjs-node/index.js").Errors;

describe("PushMeSDK ESM Import", function () {
    const pushMeInstance = new PushMeSDK();

    describe("API Class", function () {
        it("check consts", async () => {
            expect(PushMeSDK.BACKEND_URL).to.exist.and.equal(defaultBackendUrl);

            const { BUTTON_YES_NO, BUTTON_OPEN_LINK } = Consts.PushCategory;

            expect(BUTTON_YES_NO).to.exist.and.equal("button.yes_no");
            expect(BUTTON_OPEN_LINK).to.exist.and.equal("button.open_link");
        });

        it("check instance", async () => {
            expect(pushMeInstance.backendUrl).to.exist.and.equal(testBackendUrl);
        });

        it("check errors", async () => {
            expect(Errors.UnauthorizedError).to.exist;
        });
    });
});
