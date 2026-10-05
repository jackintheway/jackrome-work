# Domain decisions

Moved out of `CLAUDE.md` on 2026-10-05. Verbatim except notes marked
"[Note 2026-10-05: ...]".

Settled since (per Jack, 2026-10-05): the Squarespace website subscription ended
2026-09-15 as planned and every domain is working. The 2026-09-15 deadlines below
are history. Two facts stay loaded in `CLAUDE.md`: `jackintheway.net` carries MX,
so delete only the Squarespace Defaults preset; and a 401 "Login Redirect" means the
Netlify project is Private.

## The domains (mapped 2026-08-18)

**The cutover is five domains, not one.** All eight of Jack's domains are registered at
Squarespace and are staying there. Auto-renew on the *website* subscription was
cancelled 2026-08-18; the site serves until 2026-09-15.

Verified live, not read off the dashboard:

**Updated 2026-08-24: four of the five moved to Netlify the same day as the cutover.**

| Domain | Resolves to | Served by | Renews |
|---|---|---|---|
| `jackrome.work` | the site (primary) | **Netlify** | 2027-06-29 |
| `jack-rome.com` | 301 to `jackrome.work` | **Netlify** | 2027-07-27 |
| `jackintheway.work` | 301 to `jackrome.work` | **Netlify** | **2026-09-07** |
| `jackrome.me` | 301 to `jackrome.work` | **Netlify** | 2027-05-16 |
| `jackintheway.net` | 301 to `jackrome.work` | Squarespace | 2027-05-02 |

`jackintheway.net` is deliberately last, because it carries the live Google Workspace
MX for `jack@jackintheway.net`. Moving it is the same preset swap as the others, with
one rule: delete **only** the Squarespace Defaults preset. Its `netlify.toml` redirects
are already written and waiting.

### Two things Netlify does that Squarespace did not

**Netlify serves a domain alias at 200 rather than redirecting it.** Squarespace 301d
all four aliases to `jackrome.work`. Netlify does not, so after moving `jack-rome.com`
the entire site answered on two addresses. Netlify *does* redirect `www.jackrome.work`
to the apex on its own, which is what made this easy to miss: it handles www-versus-apex
within one domain and not a separate domain. Fixed with explicit host rules in
`netlify.toml`, where a `from` carrying a scheme and host matches on host and `:splat`
carries the path across. Verified: `jack-rome.com/wayspace` lands on
`jackrome.work/wayspace`, not the home page.

**Both the bare and the www form of every domain must be added in Netlify's domain
panel.** The certificate only covers hostnames Netlify knows about, and the Squarespace
Netlify preset creates a `www` CNAME regardless. So an unregistered form resolves and
then fails the TLS handshake, which is a browser security warning rather than a clean
failure. `jackintheway.work` briefly broke this way when its bare form was swapped for
its www form rather than added alongside it, and the bare form is the one people type.

All ten hostnames verified live 2026-08-24: the apex serves 200, the other nine 301 to
it, paths survive, and the certificate covers every name.

[Note 2026-10-05: the three rows below were stranded under the paragraph above and have
been put back into a table of their own. The forwarding targets are as recorded
2026-08-24: `jackintheway.me` forwards to bio.site, not Fourthwall as these rows
first said, and `jackintheway.store`'s target was still unconfirmed.]

| Domain | Forwards to | Renews |
|---|---|---|
| `jackintheway.me` | `jackintheway.store`, then the Fourthwall shop (confirmed by Jack and a live check, 2026-10-05) | 2027-06-10 |
| `jackintheway.store` | `wayspace-shop.fourthwall.com` (confirmed by a live check, 2026-10-05) | 2027-08-05 |
| `wayspace.store` | Fourthwall | 2027-08-05 |

### What this means for the cutover

**The four 301s most likely die with the site on 2026-09-15.** The dashboard labels
`jackintheway.me`, `jackintheway.store`, and `wayspace.store` with an explicit
"Forwards to" line and labels the other five with nothing, which reads as forwarding
being a domain-level feature and the rest being domains *connected to a site*. Jack has
real evidence that forwarding survives cancellation: the three Fourthwall forwards are
attached to his old `jackintheway.net` site, which he cancelled a while ago, and they
still work.

That evidence covers the forwards. It does not cover the four connected domains, which
hang off the very site being cancelled. Treat them as dying until proven otherwise.
Either way the fix is the same, so this does not need resolving in advance, only
verifying after.

The fix is Netlify **domain aliases**: add all five to the site, set `jackrome.work` as
primary, and Netlify redirects the aliases to it. Same behaviour Squarespace is
providing now. Each alias needs its DNS pointed at Netlify, so budget time for five DNS
changes plus propagation, not one.

### Three vanity subdomains, found 2026-08-24 during the cutover

Not in this file before, and not visible from outside: they only surfaced in
Squarespace's DNS panel, under a **Squarespace Domain Forwarding** preset sitting
beside the Squarespace Defaults one. All three are CNAMEs to `ext-sq.squarespace.com`
that Squarespace's forwarding service answers with a 302.

| Subdomain | Forwards to |
|---|---|
| `artifacts.jackrome.work` | a Claude artifact URL |
| `profile.jackrome.work` | `linkedin.com/in/jackrome` |
| `ai.jackrome.work` | `jackrome.work/ai-enablement` |

**They are unaffected by the DNS cutover.** Deleting the Squarespace Defaults preset
does not touch the forwarding preset, so all three kept working when the apex moved to
Netlify.

**They are on the 2026-09-15 clock.** The likely outcome is that they survive, since
this is the same domain-level forwarding feature that outlived a cancelled site for the
three Fourthwall forwards on `jackintheway.net`. So the job is to verify after
cancellation, not to rebuild in advance. If they do die, Netlify can serve the same
redirects: add each as a domain alias and write a host-scoped rule in `netlify.toml`.

`ai.jackrome.work` is the least urgent of the three. `/ai` already 301s internally to
`/ai-enablement`, so nothing on this site depends on the subdomain.

### Open questions, all with a 2026-09-15 deadline

1. ~~The mail icon on `jackintheway.net`.~~ **Closed 2026-08-18.** A `jack@jackintheway.net`
   address Jack set up around 2020 and no longer uses, still forwarding to
   `jackintheway@gmail.com`. Not on the critical path.
2. ~~Do the Fourthwall forwards survive?~~ **Closed 2026-08-18.** They already survive a
   cancelled site: they hang off the old `jackintheway.net` site, cancelled a while back,
   and still resolve. `wayspace.store` is safe.
3. **`jackintheway.work` renews 2026-09-07**, about three weeks out and before the site
   goes down. It is a duplicate pointing at the same place as four other domains. Jack
   is leaning keep, not decided.
4. ~~The `jackintheway.me` discrepancy.~~ **Closed 2026-08-18.** It does forward to
   `bio.site/jackintheway` correctly. The dashboard thumbnail showing the store is
   stale, the forward is not.

### bio.site and Wayspace, an open question (raised 2026-08-18)

[Note 2026-10-05: settled. `jackintheway.me` now 301s to `jackintheway.store`, which 301s to the Fourthwall shop. Neither points at bio.site any more, so the bio.site notes below are history, and the plan to point `.me` at a replacement page no longer applies as written.]

`bio.site/jackintheway` is Jack's de facto music and video home, and his link-in-bio.
It became that when he cancelled the old `jackintheway.net` site. `jackintheway.me`
forwards to it, and the About page links to it.

Jack raised whether Wayspace replaces it, or whether bio.site stays as a lobby in front
of Wayspace for his creator and musician self. Not decided, and it does not block the
build. But it wants holding during the gathering session, because **the Wayspace landing
as described is structurally a link-in-bio already**: floating puzzle pieces that each
route somewhere, over a plain clickable list of the same destinations. That is what a
link-in-bio does, in Jack's own hands rather than a template.

If Wayspace absorbs the job, the music room needs the streaming links carried prominently
(Spotify, Apple Music, wherever else), because sending someone to a stream is most of what
a music link-in-bio is for. That is a room-list consideration, so it belongs in the
gathering session and not after it.

The argument for keeping bio.site: it is zero maintenance and loads instantly on a bad
phone connection off an Instagram tap, which is the actual context. Wayspace will be
heavier than that by design.

**Jack's own answer arrived 2026-08-24, not urgent, not for today:** replace bio.site
with a page that lives on this site, and point `jackintheway.me` at it instead of at
bio.site. That resolves the question above in Wayspace's favor without asking the
whole house to carry the job: one page built for the fast, single-tap context
bio.site exists for, rather than the landing or a room doing double duty.

**Domain forwarding confirmed 2026-08-24, resolving the discrepancy this section used
to flag:** `jackintheway.me` forwards to bio.site, and `jackintheway.net` already
forwards to `jackrome.work` itself, not to bio.site. So only `.me` would need to move
when this gets built; `.net` already points at the right house and would just need
its target page to exist once the new page does. `jackintheway.store`'s target is
still unconfirmed. Not scheduled. Revisit when there is room for it.
