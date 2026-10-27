#!/usr/bin/env node
// Registers a released FateX version on foundryvtt.com through the Package Release API
// (https://foundryvtt.com/article/package-release-api/).
//
//   node scripts/foundry-release.mjs <version> [--dry-run]
//
// Runs in the release workflow after a tag and in the manual "Foundry release" workflow.
// The version must already exist as a GitHub release with its system.json asset. Compatibility is taken
// from that manifest, so the package page always matches what Foundry checks on install.
// The token is read from FOUNDRY_PACKAGE_TOKEN (repository secret) and never printed.
// Without it the payload is only shown.

const REPO = "anvil-vtt/FateX";
const API = "https://foundryvtt.com/_api/packages/release_version/";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const version = args.find((arg) => !arg.startsWith("--"));

if (!version) {
    console.error("Usage: node scripts/foundry-release.mjs <version> [--dry-run]");
    process.exit(2);
}

const manifestUrl = `https://github.com/${REPO}/releases/download/${version}/system.json`;
const response = await fetch(manifestUrl);
if (!response.ok) {
    console.error(`No system.json in the GitHub release ${version} (${response.status}).`);
    process.exit(1);
}
const manifest = await response.json();

const problems = [];
if (manifest.version !== version) {
    problems.push(`the manifest says version ${manifest.version}`);
}
if (!manifest.download?.includes(`/releases/download/${version}/`)) {
    problems.push(`its download URL is not pinned to ${version}: ${manifest.download}`);
}
if (problems.length) {
    console.error(`The release ${version} does not fit: ${problems.join("; ")}.`);
    process.exit(1);
}

const { minimum, verified, maximum } = manifest.compatibility ?? {};
const body = {
    id: manifest.id,
    ...(dryRun ? { "dry-run": true } : {}),
    release: {
        version,
        manifest: manifestUrl,
        notes: `https://github.com/${REPO}/releases/tag/${version}`,
        compatibility: { minimum, verified, ...(maximum ? { maximum } : {}) },
    },
};

const token = process.env.FOUNDRY_PACKAGE_TOKEN;
if (!token) {
    const note = "FOUNDRY_PACKAGE_TOKEN is not set, nothing was sent.";
    console.log(process.env.GITHUB_ACTIONS ? `::warning::${note}` : note);
    console.log("Payload:");
    console.log(JSON.stringify(body, null, 2));
    process.exit(0);
}

const result = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(body),
});
const text = await result.text();
console.log(`${result.status}${dryRun ? " (dry run)" : ""}: ${text}`);
if (result.status === 429) {
    console.log(`Retry after ${result.headers.get("retry-after")} seconds.`);
}
process.exit(result.ok ? 0 : 1);
