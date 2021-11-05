import { SugarCubeStoryVariables } from "twine-sugarcube";

export interface JoyrideMessage {
    subject: string,
    from: string,
    body: string,
    read?: boolean
}

interface JoyrideStoryVariables extends SugarCubeStoryVariables {
    [x:string]: any,
    messages?: [JoyrideMessage]
}

const getStoryVariables = () => {
    return (State.variables as JoyrideStoryVariables);
}

export const unreadMessagesCount = () => {
    const messages = getStoryVariables().messages;

    if (Array.isArray(messages)) {
        const found = messages.filter(function (message) {
            return !message.read;
        });
        return found.length;
    }

    return 0;
}

export const addMessage = (newMessage: JoyrideMessage) => {
    const messages = getStoryVariables().messages;
    if (Array.isArray(messages)) {
        const existing = messages.find(function (message) {
            return (
                newMessage.subject === message.subject &&
                newMessage.from === message.from &&
                newMessage.body === message.body
            );
        });

        if (!existing) {
            messages.push(newMessage);
            State.setVar("messages", messages);
            UIBar.update();
        }
    }
}
