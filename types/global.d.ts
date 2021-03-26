import { FatexConfig } from "../src/config";

declare global {
    interface CONFIG {
        FateX: FatexConfig;
    }

    interface Actor {
        isTemplateActor: boolean;
    }
}
