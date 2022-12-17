export const BACKEND_URL = "https://pushme.tgxn.net";

// `actions` docs: https://docs.expo.dev/versions/latest/sdk/notifications/#arguments-21
export const NotificationDefinitions = {
    "simple.push": {
        title: "Simple Push",
        sendDefaultAction: true,
    },
    "button.approve_deny": {
        title: "Approve/Deny Buttons",
        sendDefaultAction: false, // dont send a default action when the notification is tapped
        actions: [
            {
                identifier: "approve",
                buttonTitle: "Approve",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
            {
                identifier: "deny",
                buttonTitle: "Deny",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "button.yes_no": {
        title: "Yes/No Buttons",
        sendDefaultAction: false, // dont send a default action when the notification is tapped
        actions: [
            {
                identifier: "yes",
                buttonTitle: "Yes",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
            {
                identifier: "no",
                buttonTitle: "No",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "button.acknowledge": {
        title: "Acknowledge Button",
        sendDefaultAction: false, // dont send a default action when the notification is tapped
        actions: [
            {
                identifier: "acknowledge",
                buttonTitle: "Acknowledge",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "button.open_link": {
        title: "Open Link Button",
        sendDefaultAction: true,
        actions: [
            {
                identifier: "open_link",
                buttonTitle: "Open Link",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "input.reply": {
        title: "Reply Input",
        sendDefaultAction: true,
        actions: [
            {
                identifier: "reply",
                buttonTitle: "Reply",
                textInput: {
                    submitButtonTitle: "Reply",
                    // placeholder: "Type a reply...", // https://github.com/expo/expo/issues/20500
                },
                options: {
                    opensAppToForeground: false,
                    // isAuthenticationRequired: false,
                },
            },
        ],
    },
    "input.submit": {
        title: "Submit Input",
        sendDefaultAction: true,
        actions: [
            {
                identifier: "submit",
                buttonTitle: "Submit",
                textInput: {
                    submitButtonTitle: "Submit",
                    // placeholder: "Type a message...", // https://github.com/expo/expo/issues/20500
                },
                options: {
                    opensAppToForeground: false,
                    // isAuthenticationRequired: false,
                },
            },
        ],
    },
};
