interface StressData {
    name: string;
}

export interface StressItemData {
    type: "stress";
    data: StressData;
}

///////////////////////////////

interface AspectData {
    name: string;
}

export interface AspectItemData {
    type: "aspect";
    data: AspectData;
}

///////////////////////////////

interface TokenReferenceData {
    id: string;
    scene: string;
}

export interface TokenReferenceItemData {
    type: "tokenReference";
    data: TokenReferenceData;
}

///////////////////////////////

interface CombatantReferenceData {
    id: string;
}

export interface CombatantReferenceItemData {
    type: "combatantReference";
    data: CombatantReferenceData;
}

///////////////////////////////

interface ActorReferenceData {
    id: string;
}

export interface ActorReferenceItemData {
    type: "actorReference";
    data: ActorReferenceData;
}

///////////////////////////////

interface ExtraData {
    description: string;
    parentID: string;
}

export interface ExtraItemData {
    type: "extra";
    data: ExtraData;
}

///////////////////////////////

interface SkillData {
    rank: number;
}

export interface SkillItemData {
    type: "skill";
    data: SkillData;
}

///////////////////////////////

interface ConsequenceData {
    label: string;
}

export interface ConsequenceItemData {
    type: "consequence";
    data: ConsequenceData;
}

///////////////////////////////

export type ReferenceItemData = TokenReferenceItemData | ActorReferenceItemData | CombatantReferenceItemData;
export type FateItemData =
    | StressItemData
    | AspectItemData
    | TokenReferenceItemData
    | ActorReferenceItemData
    | ExtraItemData
    | SkillItemData
    | ConsequenceItemData;
