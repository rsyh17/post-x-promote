// Promote make.fun's make-your-own-bounty post on X — make.fun entry.
//
// The entry itself is a post on X: a quote-post of @makefunai's
// make-your-own-bounty announcement, published from the owner's public
// account with its own photo attached. The post carries the @makefunai
// tag, the sponsor link and the owner's play code (res4jwe8).
//
// POST.json, sitting next to this file in the repository, names the
// post and is the source of truth for its URL. This program reads that
// file, validates the URL strictly, and hands the post in by writing
// the canonical {"url": ...} document to /output/POST.json; it also
// echoes the URL to stdout and keeps a plain copy in /output/entry.txt.
// Run it with --check to validate and print "ok: <url>" without
// writing anything. No network access anywhere.
//
// The bot directory is MAKEFUN_BOT_DIR when set (the grader mounts the
// repository there); otherwise it is this file's own directory, so a
// plain local run works too. The output directory is
// MAKEFUN_OUTPUT_DIR, defaulting to /output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function botDir(): string {
  return process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
}

// Guard the hand-in: the value handed in must be a single well-formed
// x.com status URL, whatever POST.json is edited to later. Parse it for
// real instead of trusting a regex over the raw string: require the
// https scheme, the exact x.com host, and a /<user>/status/<id> path.
function validatePostUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`entry is not a valid URL: ${raw}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`entry URL must use https, got: ${raw}`);
  }
  if (url.host !== "x.com") {
    throw new Error(`entry URL must be on x.com, got: ${raw}`);
  }
  if (!/^\/[A-Za-z0-9_]+\/status\/\d+$/.test(url.pathname)) {
    throw new Error(`entry URL must be a status URL, got: ${raw}`);
  }
  return raw;
}

// Read POST.json from the bot directory and return its validated URL.
// Any problem — missing file, malformed JSON, a missing or non-string
// url field, a URL that fails validation — throws, and main() turns
// that into a stderr message and exit 1.
function entryUrl(): string {
  const path = join(botDir(), "POST.json");
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(
      `cannot read POST.json at ${path}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  const url = (parsed as { url?: unknown } | null)?.url;
  if (typeof url !== "string") {
    throw new Error(`POST.json at ${path} has no string "url" field`);
  }
  return validatePostUrl(url);
}

function main(): void {
  let url: string;
  try {
    url = entryUrl();
  } catch (err) {
    console.error(
      `error: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }
  // --check: validate and report only, never touch the output files.
  if (process.argv.includes("--check")) {
    console.log(`ok: ${url}`);
    return;
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "POST.json"),
    JSON.stringify({ url }, null, 2) + "\n",
    "utf8",
  );
  writeFileSync(join(outDir, "entry.txt"), url + "\n", "utf8");
  console.log(url);
}

main();
