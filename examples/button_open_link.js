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
      title: "you ned to do this thing",
      body: "go to this page",
      categoryId: "button.open_link",
      linkUrl: "https://www.google.com",
    });

    const pushIdent = requestedApproval.pushIdent;
    console.log(`Push Ident: ${requestedApproval.pushIdent}`);

    const pushStatus = await pushmeClient.longPollPushStatus(pushIdent);
    if (pushStatus.serviceResponse) {
      if (pushStatus.serviceResponse.actionIdentifier === "approve") {
        console.log(`User Approved!`);
      } else if (pushStatus.serviceResponse.actionIdentifier === "deny") {
        console.log(`User Denied!`);
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
