import "../scss/style.scss";
import { createPopper } from "@popperjs/core";

window.setup = {
    $tooltips: [],
    poppers: [],
};

window.setup.createPopper = (tooltipText, direction, text, output) => {
    const tooltipContent = $("<div>")
        .addClass("tooltip-text")
        .data("show", "false")
        .append(
            tooltipText,
            $("<div>").addClass("arrow").attr("data-popper-arrow", "")
        );

    const tooltipTrigger = $("<span>")
        .addClass(`tooltip-trigger`)
        .attr("aria-describedby", "tooltip")
        .html(text)
        .on("mouseenter", function () {
            tooltipContent.attr("data-show", "true");
        })
        .on("mouseleave", function () {
            tooltipContent.attr("data-show", "false");
        });

    $(output).append(tooltipTrigger);
    $(output).append(tooltipContent);
    window.setup.$tooltips.push(tooltipContent);

    const popperInstance = createPopper(
        tooltipTrigger.get(0),
        tooltipContent.get(0),
        {
            placement: direction || "auto",
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        }
    );
    window.setup.poppers.push(popperInstance);
};

// Ex. When the UI Bar changes from stowed
window.setup.updatePoppers = function() {
    window.setup.poppers.forEach(function(p) { p.update(); });
}

window.setup.hideActions = function() {
    $("#action-bar").attr("data-hide", "true");
}

window.setup.showActions = function() {
    $("#action-bar").attr("data-hide", "false");
}

function setupUIBarObserver() {
    if (!window.MutationObserver) {
        return;
    }

    const observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                // class changed, we aren't worried about what happened
                // Wait for the animation to finish though.
                setTimeout(function() {
                    window.setup.updatePoppers && window.setup.updatePoppers();
                }, 250);
            }
        })
    });

    observer.observe(document.querySelector("#ui-bar"), { attributes: true });
}

(() => {
    $(document).on(":storyready", () => {
        setupUIBarObserver();
    })
    $(document).on(":passageinit", () => {
        // Clear old popups
        window.setup.$tooltips.forEach(function($tooltip) {
            $tooltip.remove();
        });
        window.setup.$tooltips = [];
    });

    $(document).on(":passagerender", (e) => {
        $(e.content).find("button.link-broken").prop("disabled", true);
    });
})()
