import { FateItemData } from "../item/ItemTypes";
import { ActorFate } from "./ActorFate";

interface CharacterData {
    isTemplateActor: boolean;
}

interface CharacterActorData extends Actor.Data<CharacterData, FateItemData> {
    type: "character";
}

interface GroupData {
    groupType: string;
    availableTokens: {
        [id: string]: ActorFate;
    };
}

interface GroupActorData extends Actor.Data<GroupData, FateItemData> {
    type: "group";
}

export type ActorDataFate = CharacterActorData | GroupActorData;
