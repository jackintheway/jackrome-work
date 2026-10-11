# Importing lyrics from the vault

Moved out of `CLAUDE.md` on 2026-10-11 during an instruction-file audit, so it loads only when a task touches it. Dated decisions; verify against the current files before acting on them.

Lyric pages live at `/wayspace/writing/{slug}`. The non-album lyrics came from
the vault export in `_source/writing/lyrics/`.

Three things in those files are vault furniture rather than song, and
all three reached a public page before being caught:

1. **Vault annotation.** 44 of the 53 end with a `---` rule and then
   `**Claude's Commentary**` or `**Notes worth creating from this
   entry:**`, left by earlier delivery runs. These rendered as closing
   verses. Anything from that marker down is cut.
2. **Front matter inside the body.** 30 files repeat title, written,
   released and album as the opening lines of the body as well as in
   the YAML above it. That rendered as the first verse.
3. **`[[wikilinks]]`**, in all fifty. They point at vault notes that do
   not exist on this site, so they are flattened to their text.
   `[[a|b]]` keeps `b`. Bare `#tag` lines go entirely.

**Any future import from the vault must do all three.** The generator
is not kept as a script, so this is the record of what it had to do.
