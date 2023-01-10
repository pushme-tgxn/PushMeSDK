# PushMe API Library

Can be used to communicate with a [PushMe Server](https://github.com/pushme-tgxn/PushMeServer) instance.

Client and Server side usage supported.

## Installation

`npm install @pushme-tgxn/pushmesdk`


## Client-Side Usage

Client-side usage is used when you want to interact with a PushMe Server instance as a user.

```js
import PushMeSDK from "@pushme-tgxn/pushmesdk";

const pushMe = new PushMeSDK();
const loggedIn = await pushMe.user.emailLogin("example@example.com", "Hunter2");
```


## Server-Side Usage

Server-Side usage can be used to send push notifications, and check for responses.

### NodeJS

Send a Push message given a client secret.

```js
import PushMeSDK from "@pushme-tgxn/pushmesdk";

const pushMe = new PushMeSDK();
const pushedMessage = await pushMe.user.pushToTopic(topicSecret, {
    title: "Hello World!",
    body: "This is a test message."
});
```


Library Build inspired by https://github.com/uuidjs/uuid/tree/main
