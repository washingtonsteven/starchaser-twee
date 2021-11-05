import { createPopper, updatePoppers } from "./setup/popper_setup";
import { addMacros } from "./setup/sugarcube_macros";
import { addMessage, unreadMessagesCount } from "./setup/sugarcube_setup";
import { Instance as PopperInstance, Placement } from "@popperjs/core";
import { JoyrideMessage } from "./types/storyVariables";

class Setup {
    $tooltips: Array<JQuery> = [];
    poppers: Array<PopperInstance> = [];

    constructor() {
        $(document).on(":storyready", () => {
            this.setup_UIBar_observer();
        });
        $(document).on(":passageinit", () => {
            // Clear old popups
            this.$tooltips.forEach(function ($tooltip) {
                $tooltip.remove();
            });
            this.$tooltips = [];
        });

        $(document).on(":passagerender", (e) => {
            $(e.content).find("button.link-broken").prop("disabled", true);
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

        const observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // class changed, we aren't worried about what happened
                    // Wait for the animation to finish though.
                    setTimeout(function () {
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
}

export { Setup };
