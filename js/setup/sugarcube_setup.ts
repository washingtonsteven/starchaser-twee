import { JoyrideMessage, JoyrideStoryVariables } from "../types/storyVariables";

const getStoryVariables = () => {
    return (State.variables as JoyrideStoryVariables);
}

export const unreadMessagesCount = () => {
    const messages = getStoryVariables().messages;

    if (Array.isArray(messages)) {
        const found = messages.filter((message) => {
            return !message.read;
        });
        return found.length;
    }

    return 0;
}

export const addMessage = (newMessage: JoyrideMessage) => {
    const messages = getStoryVariables().messages;
    if (Array.isArray(messages)) {
        const existing = messages.find((message) => {
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
