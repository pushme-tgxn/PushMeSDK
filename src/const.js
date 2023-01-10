export const BACKEND_URL = "https://pushme.tgxn.net";

export const DEFAULT_TIMEOUT = 1000;
export const POLLING_TIMEOUT = 60 * 1000;

export const DEFAULT_ACTION_IDENTIFIER = "expo.modules.notifications.actions.DEFAULT";

// `actions` docs: https://docs.expo.dev/versions/latest/sdk/notifications/#arguments-21
export const PushCategory = {
    SIMPLE: "simple.push",
    BUTTON_APPROVE_DENY: "button.approve_deny",
    BUTTON_YES_NO: "button.yes_no",
    BUTTON_ACKNOWLEDGE: "button.acknowledge",
    BUTTON_OPEN_LINK: "button.open_link",
    INPUT_REPLY: "input.reply",
    INPUT_SUBMIT: "input.submit",
};

export const PushDefinition = {
    [PushCategory.SIMPLE]: {
        title: "Simple Push",
        sendDefaultAction: true,
    },
    [PushCategory.BUTTON_APPROVE_DENY]: {
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
    [PushCategory.BUTTON_YES_NO]: {
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
    [PushCategory.BUTTON_ACKNOWLEDGE]: {
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
    [PushCategory.BUTTON_OPEN_LINK]: {
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
    [PushCategory.INPUT_REPLY]: {
        title: "Reply Input",
        sendDefaultAction: false,
        hasTextInput: true,
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
                    // isAuthenticationRequired: false,
                },
            },
        ],
    },
    [PushCategory.INPUT_SUBMIT]: {
        title: "Submit Input",
        sendDefaultAction: false,
        hasTextInput: true,
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
                    // isAuthenticationRequired: false,
                },
            },
        ],
    },
};
