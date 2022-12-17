# PushMe API Library

Can be used to communicate with a [PushMe Server](https://github.com/pushme-tgxn/PushMeServer) instance.

Client and Server side usage supported.


## Usage

## Install

`npm install pushme-sdk`

## Usage As Server-Side

```js
const PushMe = require("pushme-sdk");

const pushMe = new PushMe({
    backendUrl: "",
    accessToken: "" // if known
});

pushMe.user.emailLogin(userName, password);

