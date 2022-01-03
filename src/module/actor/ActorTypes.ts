import { FateActor } from "./FateActor";

interface CharacterData {
    isTemplateActor: boolean;
}

interface CharacterActorData {
    type: "character";
    data: CharacterData;
}

export type groupType = "manual" | "scene" | "encounter";

interface GroupData {
    groupType: groupType;
    availableTokens: {
        [id: string]: FateActor;
    };
}

interface GroupActorData {
    type: "group";
    data: GroupData;
}

export type ActorDataFate = CharacterActorData | GroupActorData;
