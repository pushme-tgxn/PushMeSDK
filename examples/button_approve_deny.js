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
      title: "Would you like approve this request?",
      body: "Login to xyz.com / Approve Requests etc",
      categoryId: "button.approve_deny",
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
