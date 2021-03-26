import { FatexConfig } from "../src/config";

declare global {
    interface CONFIG {
        FateX: FatexConfig;
    }

    interface Actor {
        isTemplateActor: boolean;
    }

    const __ALL_TEMPLATES__: string;
}
