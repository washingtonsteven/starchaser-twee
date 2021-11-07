import { createPopper as popperCreatePopper, Placement } from "@popperjs/core";
import type { Setup } from "../setup";

export const createPopper = (
    tooltipText: string,
    direction: Placement,
    text: string,
    output: ParentNode,
    setup: Setup
) => {
    const tooltipContent = $("<div>")
        .addClass("tooltip-text")
        .attr("data-show", "false")
        .append(
            tooltipText,
            $("<div>").addClass("arrow").attr("data-popper-arrow", "")
        );

    const tooltipTrigger = $("<span>")
        .addClass(`tooltip-trigger`)
        .attr("aria-describedby", "tooltip")
        .html(text)
        .on("mouseenter", () => {
            tooltipContent.attr("data-show", "true");
        })
        .on("mouseleave", () => {
            tooltipContent.attr("data-show", "false");
        });

    $(output).append(tooltipTrigger);
    $(output).append(tooltipContent);
    setup.$tooltips.push(tooltipContent);

    const popperInstance = popperCreatePopper(
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
    setup.poppers.push(popperInstance);
};

export const updatePoppers = (setup: Setup) => {
    setup.poppers.forEach((p) => {
        p.update();
    });
};
