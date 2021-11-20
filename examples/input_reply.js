require("dotenv").config({ path: `./.env` });

const { BACKEND_URL, PUSH_TOKEN } = process.env;

if (!BACKEND_URL || BACKEND_URL == "") {
  throw new Error("Missing BACKEND_URL in .env");
}

if (!PUSH_TOKEN || PUSH_TOKEN == "") {
  throw new Error("Missing PUSH_TOKEN in .env");
}

const PushMeSDK = require("../src/");

async function main() {
  const pushmeClient = new PushMeSDK({
    backendUrl: process.env.BACKEND_URL,
  });

  let requestedApproval;
  try {
    requestedApproval = await pushmeClient.requestPush(PUSH_TOKEN, {
      title: "Friend sent you a message!",
      body: "Hey, what's going on?!",
      categoryId: "input.reply",
    });

    const { pushIdent } = requestedApproval.data;
    console.log(`Push Ident: ${pushIdent}`);

    const pushStatus = await pushmeClient.longPollStatus(pushIdent);
    if (pushStatus.serviceResponse) {
      if (pushStatus.serviceResponse.actionIdentifier === "reply") {
        console.log(`User Reply: ${pushStatus.serviceResponse.userText}`);
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
