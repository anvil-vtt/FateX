import { FatexConfig } from "./config.ts";

declare global {
    const CONFIG: {
        FateX: FatexConfig;
    };
}
