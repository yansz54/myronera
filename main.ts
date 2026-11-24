// Post the Meme, Win the Feed — u-myronera-post-the-meme-win-the-feed-2de960bf
// The entry is the X post named in POST.json. This program copies POST.json
// from the repository to /output; that is all it has to do. The house reads
// the post itself and writes its counts to /output/post.counts.json.
// The copy is deliberately the whole program: no network, no clock, no
// randomness, no extra files in /output. The gate scorer reads POST.json
// from /output and the house's counts file beside it; anything else the
// program wrote would be ignored or, worse, mistaken for the entry. A
// byte-for-byte copy keeps the post URL exactly as submitted, so the
// house's FxTwitter read and the gate's URL check see the same address.
import { copyFileSync, mkdirSync } from "node:fs";

// POST.json contract: a JSON object {"url": "https://x.com/<handle>/status/<id>"}.
// The file in this repo holds the live X post URL:
// https://x.com/yanszwjg/status/2125226272280453265 — posted from @yanszwjg
// with @_myronera and play code makefun-tarragon-lilac-palette. This
// program never edits the URL itself, so whatever POST.json holds at submit
// time is exactly what the house grades.
mkdirSync("/output", { recursive: true });
copyFileSync("POST.json", "/output/POST.json");
console.log("POST.json copied to /output");
