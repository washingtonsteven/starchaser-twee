import { Setup } from "../setup";

type SetupWithCont = Setup & {
    cont: (keypress: boolean, callback: () => void) => {};
};

export const addMacros = (setup: Setup) => {
    addTooltipMacro(setup);
    addConvoMacro(setup as SetupWithCont);
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

export const addConvoMacro = (setup: SetupWithCont) => {
    Macro.add("convo", {
        tags: null,
        handler: function () {
            const character = this.args[0];
            const lines = this.args[1];
            const replaceLine = this.args[2] || true;
            let lineIndex = 0;

            const makeLine = (withCharacter = false) => {
                const typeLine = `<<type 40ms>>${lines[lineIndex]}<</type>>`;

                if (withCharacter) {
                    return `<<${character}>>${typeLine}<</${character}>>`; // TODO: use <<say>> instead in case the character name isn't macro-safe
                } else {
                    return typeLine;
                }
            };

            const $convo = $("<div>").addClass(".convo");
            $convo.wiki(makeLine(true));

            const nextLink = () => {
                lineIndex++;
                if (lineIndex >= lines.length) {
                    $(document).one(":typingcomplete", () => {
                        $.wiki(this.payload[0].contents);
                    });
                    return;
                }

                setup.cont(true, () => {
                    const $convoArea = $convo.find(".say p:last-of-type");
                    if (replaceLine) {
                        $convoArea.empty();
                    }
                    $convoArea.wiki(makeLine());
                    nextLink();
                });
            };

            nextLink();
            $(this.output).append($convo);
        },
    });
};
