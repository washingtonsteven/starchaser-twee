import { SugarCubeStoryVariables } from "twine-sugarcube";

export interface JoyrideMessage {
    subject: string,
    from: string,
    body: string,
    read?: boolean
}

/**
 * This is not an exhaustive list of variables in the story
 * These are only the variables that are used in JS
 * Variables that are only referenced in Twine are omitted
 */
export interface JoyrideStoryVariables extends SugarCubeStoryVariables {
    [x:string]: any,
    messages?: [JoyrideMessage]
}