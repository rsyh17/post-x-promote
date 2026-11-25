// Promote make.fun's make-your-own-bounty post on X — make.fun entry.
//
// The entry itself is a post on X: a quote-post of @makefunai's
// make-your-own-bounty announcement, published from the owner's public
// account with its own photo attached. The post carries the @makefunai
// tag, the sponsor link and the owner's play code (res4jwe8). This
// program simply hands in that post: it writes the post's URL to
// /output/entry.txt and echoes the same URL to stdout. Run it with
// --check to validate the URL and print "ok: <url>" without writing
// anything. No network, no inputs — the URL below is the whole
// deliverable.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POST_URL = "https://x.com/Jeje1111je/status/2125652766697967962";

// Guard the hand-in: the value handed in must be a single well-formed
// x.com status URL, whatever this file is edited to later. Parse it for
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

function entryText(): string {
  return validatePostUrl(POST_URL);
}

function main(): void {
  let url: string;
  try {
    url = entryText();
  } catch (err) {
    console.error(
      `error: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }
  // --check: validate and report only, never touch the output file.
  if (process.argv.includes("--check")) {
    console.log(`ok: ${url}`);
    return;
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), url + "\n", "utf8");
  console.log(url);
}

main();
