import { FatexConfig } from "./config.ts";

declare global {
    const __ALL_TEMPLATES__: string;
    const CONFIG: {
        FateX: FatexConfig;
    };
}
