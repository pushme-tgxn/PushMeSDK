const PushMeSDK = require("../dist/node/index.cjs");

let TOPIC_SECRET = "9vp5Sr7CZYwvwe57xMujh3";

const pushmeClient = new PushMeSDK({
    backendUrl: "http://10.1.1.20:3000",
});

async function main(client, secret, pushRequest) {
    try {
        const { pushIdent } = await client.push.pushToTopic(secret, pushRequest);
        console.log(`Created Push Ident: ${pushIdent}`);

        const pushStatus = await client.push.longPollPushStatus(pushIdent);

        if (pushStatus.firstValidResponse) {
            const foundAction = client.getNotificationAction(
                pushStatus.firstValidResponse.categoryIdentifier,
                pushStatus.firstValidResponse.actionIdentifier
            );

            if (foundAction) {
                console.log("User responded with valid action ", foundAction);
            } else {
                console.log(`User responded with "${pushStatus.firstValidResponse.actionIdentifier}"`);
            }

            if (pushStatus.firstValidResponse.responseText) {
                console.log(`User entered "${pushStatus.firstValidResponse.responseText}"`);
            }
        } else {
            console.log("something else?", pushStatus);
        }
    } catch (error) {
        console.error(error.toString());
    }
}

main(pushmeClient, TOPIC_SECRET, {
    categoryId: "button.acknowledge",
    title: "You have not paid your water bill!",
    body: "Please check your latest invoice to ensure you don't get cancelled!",
});
