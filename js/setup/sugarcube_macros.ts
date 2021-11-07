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
        tags: ["line", "convocomplete"],
        handler: function () {
            const character = this.args[0];
            const direction = this.args[1] || "left";
            const replaceLine = this.args[2] || true;
            let lineIndex = 0;

            const linePayloads = this.payload.filter((p) => p.name === "line");
            if (!linePayloads) {
                const errMsg =
                    "<<convo>> macro must have a <<lines>> child macro";
                return this.error(errMsg);
            }
            const lines = linePayloads
                .map((payload) => payload.contents.trim())
                .filter((line) => line);

            const convocompletePayload = this.payload.find(
                (p) => p.name === "convocomplete"
            );

            const makeLine = (withCharacter = false) => {
                const typeLine = `<<type 40ms>>${lines[lineIndex]}<</type>>`;

                if (withCharacter) {
                    return `<<say "${character}">>${typeLine}<</say>>`;
                } else {
                    return typeLine;
                }
            };

            const $convo = $("<div>").addClass(
                `convo convo-direction-${direction}`
            );
            $convo.wiki(makeLine(true));

            const nextLine = () => {
                lineIndex++;
                if (lineIndex >= lines.length) {
                    if (convocompletePayload) {
                        $(document).one(":typingcomplete", () => {
                            $.wiki(convocompletePayload.contents);
                        });
                    }
                    return;
                }

                setup.cont(true, () => {
                    const $convoArea = $convo.find(".say p:last-of-type");
                    if (replaceLine) {
                        $convoArea.empty();
                    }
                    $convoArea.wiki(makeLine());
                    nextLine();
                });
            };

            nextLine();
            $(this.output).append($convo);
        },
    });
};
