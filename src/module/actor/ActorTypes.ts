import { FateItemData } from "../item/ItemTypes";
import { FateActor } from "./FateActor";

interface CharacterData {
    isTemplateActor: boolean;
}

interface CharacterActorData extends Actor.Data<CharacterData, FateItemData> {
    type: "character";
}

interface GroupData {
    groupType: "manual" | "scene" | "encounter";
    availableTokens: {
        [id: string]: FateActor;
    };
}

interface GroupActorData extends Actor.Data<GroupData, FateItemData> {
    type: "group";
}

export type ActorDataFate = CharacterActorData | GroupActorData;
