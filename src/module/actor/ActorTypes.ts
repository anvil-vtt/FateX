import { ItemDataFate } from "../item/ItemTypes";

interface CharacterData {
    isTemplateActor: boolean;
    isVisibleByPermission: boolean;
}

interface CharacterActorData extends Actor.Data<CharacterData, ItemDataFate> {
    type: "character";
}

interface GroupData {
    groupType: string;
}

interface GroupActorData extends Actor.Data<GroupData, ItemDataFate> {
    type: "group";
}

export type ActorDataFate = CharacterActorData | GroupActorData;
