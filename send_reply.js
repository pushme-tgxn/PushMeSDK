require("dotenv").config({ path: `./.env` });
const axios = require("axios");

const { BACKEND_URL, PUSH_TOKEN } = process.env;

if (!BACKEND_URL || BACKEND_URL == "") {
  throw new Error("Missing BACKEND_URL in .env");
}

if (!PUSH_TOKEN || PUSH_TOKEN == "") {
  throw new Error("Missing PUSH_TOKEN in .env");
}

console.log(`BACKEND_URL: ${BACKEND_URL}`);

const getPushStatus = async (pushIdent) => {
  try {
    const pushStatus = await axios.get(
      `${BACKEND_URL}/push/${pushIdent}/status`
    );
    // console.log(pushStatus.data);
    return pushStatus.data;
  } catch (error) {
    console.error(error);
  }
  return null;
};

async function main() {
  let requestedApproval;

  try {
    requestedApproval = await axios.post(`${BACKEND_URL}/push/${PUSH_TOKEN}`, {
      title: "Friend sent you a message!",
      body: "Hey, what's going on?!",
      categoryId: "input.reply",
    });
  } catch (error) {
    console.error(error);
  }

  const { pushIdent } = requestedApproval.data;
  console.log(`Push Ident: ${pushIdent}`);

  let checks = 60; // give a user 60 seconds to approve or deny

  for (let i = 0; i < checks; i++) {
    const pushStatus = await getPushStatus(pushIdent);
    if (pushStatus.serviceResponse) {
      if (pushStatus.serviceResponse.actionIdentifier === "reply") {
        // console.log("Reply:");
        console.log(`Reply: ${pushStatus.serviceResponse.userText}`);
        break;
      } else {
        console.log("something else?", pushStatus);
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main();
