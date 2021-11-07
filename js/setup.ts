import { createPopper, updatePoppers } from "./setup/popper_setup";
import { addMacros } from "./setup/sugarcube_macros";
import { addMessage, unreadMessagesCount } from "./setup/sugarcube_setup";
import { Instance as PopperInstance, Placement } from "@popperjs/core";
import { JoyrideMessage } from "./types/storyVariables";

class Setup {
    $tooltips: Array<JQuery> = [];
    poppers: Array<PopperInstance> = [];
    _isTyping = false;
    lastTypingComplete = 0;
    typingCompleteThreshold = 250;

    constructor() {
        $(document).on(":storyready", () => {
            this.setup_UIBar_observer();
        });
        $(document).on(":passageinit", () => {
            // Clear old popups
            this.$tooltips.forEach(($tooltip) => {
                $tooltip.remove();
            });
            this.$tooltips = [];
        });

        $(document).on(":passagerender", (e) => {
            $(e.content).find("button.link-broken").prop("disabled", true);
        });

        $(document).on(":typingstart", () => {
            this._isTyping = true;
        });

        $(document).on(":typingcomplete", () => {
            this._isTyping = false;
            this.lastTypingComplete = new Date().getTime();
        });

        // click to end typing
        $(document).on("click", (e) => {
            if (this.isTyping()) {
                e.preventDefault();
                $(document.body).trigger(
                    $.Event("keydown.macro-type", {
                        key: Config.macros.typeSkipKey,
                    })
                );
            }
        });

        addMacros(this);
    }

    hideActions() {
        $("#action-bar").attr("data-hide", "true");
    }

    showActions() {
        $("#action-bar").attr("data-hide", "false");
    }

    createPopper(
        tooltipText: string,
        direction: Placement,
        text: string,
        output: ParentNode
    ) {
        createPopper(tooltipText, direction, text, output, this);
    }

    updatePoppers() {
        updatePoppers(this);
    }

    setup_UIBar_observer() {
        if (!window.MutationObserver) {
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // class changed, we aren't worried about what happened
                    // Wait for the animation to finish though.
                    setTimeout(() => {
                        this.updatePoppers();
                    }, 250);
                }
            });
        });

        observer.observe(document.querySelector("#ui-bar"), {
            attributes: true,
        });
    }

    unreadMessagesCount() {
        return unreadMessagesCount();
    }

    addMessage(message: JoyrideMessage) {
        addMessage(message);
    }

    shouldContinue() {
        if (this.isTyping()) return false;
        return true;
    }

    isTyping() {
        if (this._isTyping) {
            return true;
        }

        // Also wait typingCompleteThreshold ms after typing complete to actually mark it complete
        const now = new Date().getTime();
        if (now - this.lastTypingComplete < this.typingCompleteThreshold) {
            return true;
        }

        return false;
    }
}

export { Setup };
