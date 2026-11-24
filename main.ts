// Post the Meme, Win the Feed — u-myronera-post-the-meme-win-the-feed-2de960bf
// The entry is the X post named in POST.json. This program copies POST.json
// to /output; that is all it has to do. The house reads the post itself and
// writes its counts to /output/post.counts.json.
// The copy is deliberately the whole program: no network, no clock, no
// randomness, no extra files in /output. The gate scorer reads POST.json
// from /output and the house's counts file beside it; anything else the
// program wrote would be ignored or, worse, mistaken for the entry. A
// byte-for-byte copy keeps the post URL exactly as submitted, so the
// house's FxTwitter read and the gate's URL check see the same address.
//
// The grader mounts the repository at /bot, NOT as the working directory,
// so a bare relative "POST.json" fails when the grader's cwd is elsewhere
// (that is what killed the first submission: run_completes exit 1). This
// program therefore searches several candidate locations for POST.json and
// takes the first file that exists, in this priority order:
//   1. $MAKEFUN_BOT_DIR (the grader's own pointer, when it sets one)
//   2. /bot (the grader's mount point)
//   3. the directory this script lives in (the repo root at submit time)
//   4. the current working directory
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const CANDIDATES = [
  ...new Set([
    join(BOT_DIR, "POST.json"),
    "/bot/POST.json",
    join(SCRIPT_DIR, "POST.json"),
    join(process.cwd(), "POST.json"),
  ]),
];

const source = CANDIDATES.find((p) => existsSync(p));
if (!source) {
  console.error("POST.json not found in any of these locations:");
  for (const p of CANDIDATES) console.error(`  - ${p}`);
  process.exit(1);
}

// POST.json contract: a JSON object {"url": "https://x.com/<handle>/status/<id>"}.
// The file in this repo holds the live X post URL:
// https://x.com/yanszwjg/status/2125226272280453265 — posted from @yanszwjg
// with @_myronera and play code makefun-tarragon-lilac-palette. This
// program never edits the URL itself, so whatever POST.json holds at submit
// time is exactly what the house grades.
mkdirSync(OUTPUT_DIR, { recursive: true });
const dest = join(OUTPUT_DIR, "POST.json");
try {
  copyFileSync(source, dest);
} catch (err) {
  console.error(
    `POST.json could not be copied from ${source} to ${OUTPUT_DIR}: ${(err as Error).message}`,
  );
  process.exit(1);
}
// The gate runs the program twice and requires byte-identical output, so
// verify the copy before reporting success.
if (!readFileSync(source).equals(readFileSync(dest))) {
  console.error(`POST.json copy to ${dest} does not match ${source}`);
  process.exit(1);
}
console.log(`POST.json copied from ${source} to ${dest}`);
