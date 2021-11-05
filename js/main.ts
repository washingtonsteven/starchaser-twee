import "../scss/style.scss";
import { Setup } from "./setup";

type WindowWithSetup = typeof window & {
    setup: Setup
}

(() => {
    const win = (window as WindowWithSetup);

    win.setup = new Setup();
})();
