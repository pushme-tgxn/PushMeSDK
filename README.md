# PushMe API Library

Can be used to communicate with a [PushMe Server](https://github.com/pushme-tgxn/PushMeServer) instance.

Client and Server side usage supported.

## Installation

`npm install @pushme-tgxn/pushmesdk`


## Client-Side Usage

Client-side usage is used when you want to interact with a PushMe Server instance as a user.

### NodeJS
```js
const PushMe = require("@pushme-tgxn/pushmesdk");

const pushMe = new PushMe();
const loggedIn = await pushMe.user.emailLogin("example@example.com", "Hunter2");
```

### Expo

```js
import PushMe from "@pushme-tgxn/pushmesdk";

const pushMe = new PushMe();
const loggedIn = await pushMe.user.emailLogin("example@example.com", "Hunter2");
```


## Server-Side Usage

Server-Side usage can be used to send push notifications, and check for responses.

### NodeJS

Send a Push message given a client secret.

```js
const PushMe = require("@pushme-tgxn/pushmesdk");

const pushMe = new PushMe();
const pushedMessage = await pushMe.user.pushToTopic(topicSecret, {
    title: "Hello World!",
    body: "This is a test message."
});
```
