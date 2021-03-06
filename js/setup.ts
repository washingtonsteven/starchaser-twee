import { createPopper, updatePoppers } from "./setup/popper_setup";
import { addMacros } from "./setup/sugarcube_macros";
import { addMessage, unreadMessagesCount } from "./setup/sugarcube_setup";
import { Instance as PopperInstance, Placement } from "@popperjs/core";
import { JoyrideMessage } from "./types/storyVariables";
import { Passage } from "twine-sugarcube";

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

        $(document).on(":passageinit", (e) => {
            // Clear old popups
            this.$tooltips.forEach(($tooltip) => {
                $tooltip.remove();
            });
            this.$tooltips = [];
        });

        Config.passages.onProcess = this.onPassageProcess;

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

        $(document).on("click", (e) => {
            // click to end typing
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

        this.onFrameUpdate = this.onFrameUpdate.bind(this);
        this.onFrameUpdate();
    }

    onFrameUpdate() {
        if (this.isTyping()) {
            $(".passage-section-main").scrollTop(
                $(".passage-section-main").height()
            );
        }
        window.requestAnimationFrame(this.onFrameUpdate);
    }

    hideActions() {
        $("#action-bar").attr("data-hide", "true");
    }

    showActions() {
        $("#action-bar").attr("data-hide", "false");
    }

    onPassageProcess(passage: Passage) {
        if (["Widgets", "StoryCaption"].includes(passage.title)) {
            return passage.text;
        }
        const section =
            passage.title === "PassageHeader"
                ? "header"
                : passage.title === "PassageFooter"
                ? "footer"
                : "main";
        return `<<wrapper "passage-section-${section}">>${passage.text}<</wrapper>>`;
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
