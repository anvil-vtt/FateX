import { FatexConfig } from "../src/config.ts";

declare global {
    interface CONFIG {
        FateX: typeof FatexConfig;
    }
}
