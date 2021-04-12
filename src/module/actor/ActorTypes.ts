import { ItemDataFate } from "../item/ItemTypes";
import { ActorFate } from "./ActorFate";

interface CharacterData {
    isTemplateActor: boolean;
}

interface CharacterActorData extends Actor.Data<CharacterData, ItemDataFate> {
    type: "character";
}

interface GroupData {
    groupType: string;
    availableTokens: {
        [id: string]: ActorFate;
    };
}

interface GroupActorData extends Actor.Data<GroupData, ItemDataFate> {
    type: "group";
}

export type ActorDataFate = CharacterActorData | GroupActorData;
