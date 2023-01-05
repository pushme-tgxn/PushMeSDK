export const BACKEND_URL = "https://pushme.tgxn.net";

export const DEFAULT_TIMEOUT = 1000;
export const POLLING_TIMEOUT = 60 * 1000;

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
                title: "Approve",
                identifier: "approve",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
            {
                title: "Deny",
                identifier: "deny",
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
                title: "Yes",
                identifier: "yes",
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
            {
                title: "No",
                identifier: "no",
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
                title: "Acknowledge",
                identifier: "acknowledge",
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
                title: "Open Link",
                identifier: "open_link",
                options: {
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "input.reply": {
        title: "Reply Input",
        sendDefaultAction: false,
        actions: [
            {
                title: "Reply",
                identifier: "reply",
                textInput: {
                    submitButtonTitle: "Reply",
                    // placeholder: "Type a reply...", // https://github.com/expo/expo/issues/20500
                },
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
    "input.submit": {
        title: "Submit Input",
        sendDefaultAction: false,
        actions: [
            {
                title: "Submit",
                identifier: "submit",
                textInput: {
                    submitButtonTitle: "Submit",
                    // placeholder: "Type a message...", // https://github.com/expo/expo/issues/20500
                },
                options: {
                    opensAppToForeground: false,
                    isAuthenticationRequired: false,
                },
            },
        ],
    },
};
