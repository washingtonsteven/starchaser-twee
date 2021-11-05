import { Setup } from "../setup";

export const addMacros = (setup: Setup) => {
    addTooltipMacro(setup);
};

export const addTooltipMacro = (setup: Setup) => {
    Macro.add("tooltip", {
        tags: null,
        handler: function () {
            const tooltipText = this.args[0];
            const direction = this.args[1] || "auto";
            const payload = (this.payload || []).find(
                (p) => p.name === "tooltip"
            );
            const text = (payload || {}).contents || "trigger";

            setup.createPopper(tooltipText, direction, text, this.output);
        },
    });
};
