require("dotenv").config({ path: `./.env` });

const { BACKEND_URL, PUSH_TOKEN } = process.env;

if (!BACKEND_URL || BACKEND_URL == "") {
  throw new Error("Missing BACKEND_URL in .env");
}

if (!PUSH_TOKEN || PUSH_TOKEN == "") {
  throw new Error("Missing PUSH_TOKEN in .env");
}

const PushMeSDK = require("../src/");
const pushmeClient = new PushMeSDK({
  backendUrl: process.env.BACKEND_URL,
});

async function main() {
  try {
    const requestedApproval = await pushmeClient.requestPush(PUSH_TOKEN, {
      title: "Did you just try to login?",
      body: "We think you are trying to login, proceed?",
      categoryId: "button.yes_no",
    });

    const pushIdent = requestedApproval.pushIdent;
    console.log(`Push Ident: ${requestedApproval.pushIdent}`);

    const pushStatus = await pushmeClient.longPollPushStatus(pushIdent);
    if (pushStatus.serviceResponse) {
      if (pushStatus.serviceResponse.actionIdentifier === "yes") {
        console.log(`User: Yes!`);
      } else if (pushStatus.serviceResponse.actionIdentifier === "no") {
        console.log(`User: No!`);
      } else {
        console.log("something else?", pushStatus);
      }
    } else {
      console.log("something else?", pushStatus);
    }
  } catch (error) {
    console.error(error.toString());
  }
}

main();
