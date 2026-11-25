// Promote make.fun's make-your-own-bounty post on X — make.fun entry.
//
// The entry itself is a post on X: a quote-post of @makefunai's
// make-your-own-bounty announcement, published from the owner's public
// account with its own photo attached. The post carries the @makefunai
// tag, the sponsor link and the owner's play code (res4jwe8). This
// program simply hands in that post: it writes the post's URL to
// /output/entry.txt and echoes the same URL to stdout. No network, no
// inputs — the URL below is the whole deliverable.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POST_URL = "https://x.com/Jeje1111je/status/2125652766697967962";

// Guard the hand-in: the value written must stay a single x.com status
// URL for the owner's account, whatever this file is edited to later.
function entryText(): string {
  if (!/^https:\/\/x\.com\/Jeje1111je\/status\/\d+$/.test(POST_URL)) {
    throw new Error(`entry must be the owner's X post URL, got: ${POST_URL}`);
  }
  return POST_URL;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), entryText() + "\n", "utf8");
  console.log(entryText());
}

main();
