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

type Line = {
    character: string,
    content: string,
    direction: "left" | "right",
}

export const addConvoMacro = (setup: SetupWithCont) => {
    Macro.add("convo", {
        tags: ["line", "convocomplete"],
        handler: function () {
            const character = this.args[0];
            const direction = this.args[1] || "left";
            let lineIndex = 0;
            let currentCharacter = "";

            const linePayloads = this.payload.filter((p) => p.name === "line");
            if (!linePayloads) {
                const errMsg =
                    "<<convo>> macro must have at least one <<line>> child macro";
                return this.error(errMsg);
            }
            const lines:Line[] = linePayloads
                .map((payload) : Line => ({
                    character: payload.args[0] || character,
                    content: payload.contents.trim(),
                    direction: payload.args[1] || direction,
                }))
                .filter((line) => line.content);

            const convocompletePayload = this.payload.find(
                (p) => p.name === "convocomplete"
            );

            const makeLine = () => {
                const line = lines[lineIndex];
                currentCharacter = line.character;
                const typeLine = `<<type 40ms>>${line.content}<</type>>`;
                return `<<say "${currentCharacter}">>${typeLine}<</say>>`;
            };

            const $convo = $("<div>").addClass(
                `convo convo-direction-${direction}`
            );
            $convo.wiki(makeLine());

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
                    $convo.empty();
                    $convo
                        .removeClass([
                            "convo-direction-left",
                            "convo-direction-right",
                        ])
                        .addClass(
                            `convo-direction-${lines[lineIndex].direction}`
                        );
                    $convo.wiki(makeLine());
                    nextLine();
                });
            };

            nextLine();
            $(this.output).append($convo);
        },
    });
};
