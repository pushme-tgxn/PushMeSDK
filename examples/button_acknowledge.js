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

async function main(notificationBody) {
  try {
    const requestedApproval = await pushmeClient.requestPush(
      PUSH_TOKEN,
      notificationBody
    );
    console.log(`Push Ident: ${requestedApproval.pushIdent}`);

    const pushStatus = await pushmeClient.longPollPushStatus(
      requestedApproval.pushIdent
    );
    if (pushStatus.serviceResponse) {
      if (pushStatus.serviceResponse.actionIdentifier === "acknowledge") {
        console.log(`User Acknowledged`);
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

main({
  title: "You have not paid your water bill!",
  body: "Please check your latest invoice to ensure you dont get cancelled!",
  categoryId: "button.acknowledge",
});
