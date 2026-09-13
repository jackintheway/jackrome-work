#!/usr/bin/env python3
"""Assemble the publish folder for Netlify from an explicit allowlist.

Why this exists. The site used to publish the repository root. That was
fine while every file in the repo was either a page, an asset, or a note
that a redirect rule could hide. It stops being fine the moment server
code lives here: Netlify's own docs say the functions directory must sit
outside the publish directory, or its source ships as static files.

So this script copies only what the public site needs into `_site/`, and
netlify.toml publishes that folder. Anything not listed below never
reaches the deploy: function source, prompts, fixtures, operator tools,
project notes, private exports.

There is still no compile step. Local preview serves the repo root
exactly as before. This runs only on Netlify, or by hand to check.

Usage:
    python3 tools/build-site.py           assemble _site/
    python3 tools/build-site.py --check   assemble, then verify the result

The check confirms three things: every copied file is byte-identical to
its source, every git-tracked file is either published or on the
expected-private list (nothing falls through by accident), and no
untracked file was copied locally that a Netlify checkout would not have.

Keep this compatible with the Python that Netlify's build image ships.
Standard library only, nothing newer than 3.8.
"""

import argparse
import filecmp
import fnmatch
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_site")

# Everything the public site is made of. Add to this list when a new
# public page or asset folder lands beside the HTML. A file that is not
# here is not published, on purpose.
PUBLIC_FILES = [
    "404.html",
    "about.html",
    "ai-enablement.html",
    "ai-portfolio.html",
    "index.html",
    "production.html",
    "wayspace.html",
    "robots.txt",
    "sitemap.xml",
]

PUBLIC_DIRS = [
    "assets",
    "audit",
    "case-studies",
    "css",
    "js",
    "wayspace",
]

# Never copied, even from inside a public directory.
SKIP_NAMES = {".DS_Store"}

# Tracked files that are expected to stay out of the deploy. The check
# fails if a tracked file is neither published nor matched here, so a
# new kind of file has to be placed deliberately.
EXPECTED_PRIVATE = [
    ".claude/*",
    ".gitignore",
    "*.md",
    "netlify.toml",
    "tools/*",
    "netlify/*",
]


def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


def copy_tree(src, dst):
    for dirpath, dirnames, filenames in os.walk(src):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_NAMES)
        target_dir = os.path.join(dst, os.path.relpath(dirpath, src))
        os.makedirs(target_dir, exist_ok=True)
        for name in sorted(filenames):
            if name in SKIP_NAMES:
                continue
            shutil.copy2(os.path.join(dirpath, name), os.path.join(target_dir, name))


def assemble():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    for name in PUBLIC_FILES:
        src = os.path.join(ROOT, name)
        if not os.path.isfile(src):
            sys.exit("build-site: missing public file {}".format(name))
        shutil.copy2(src, os.path.join(OUT, name))
    for name in PUBLIC_DIRS:
        src = os.path.join(ROOT, name)
        if not os.path.isdir(src):
            sys.exit("build-site: missing public directory {}".format(name))
        copy_tree(src, os.path.join(OUT, name))


def published_paths():
    out = []
    for dirpath, _, filenames in os.walk(OUT):
        for name in filenames:
            out.append(rel(os.path.join(dirpath, name)).split("_site/", 1)[1])
    return sorted(out)


def git_lines(*args):
    result = subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    )
    return [line for line in result.stdout.splitlines() if line]


def git_available():
    try:
        subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        return True
    except (OSError, subprocess.CalledProcessError):
        return False


def is_expected_private(path):
    return any(fnmatch.fnmatchcase(path, pattern) for pattern in EXPECTED_PRIVATE)


def check():
    problems = []
    published = set(published_paths())

    # 1. Byte identity between source and copy.
    for path in sorted(published):
        if not filecmp.cmp(
            os.path.join(ROOT, path), os.path.join(OUT, path), shallow=False
        ):
            problems.append("differs from source: {}".format(path))

    if not git_available():
        # The byte-identity check above stands on its own. The tracked-file
        # accounting needs git, so say so plainly rather than pass silently.
        print("build-site: {} files in _site/".format(len(published)))
        print("build-site: git unavailable, tracked-file accounting skipped")
        if problems:
            print("build-site: check FAILED")
            for line in problems:
                print("  " + line)
            sys.exit(1)
        print("build-site: byte-identity check passed")
        return

    # 2. Every tracked file is accounted for.
    tracked = set(git_lines("ls-files"))
    for path in sorted(tracked):
        if path in published:
            continue
        if os.path.basename(path) in SKIP_NAMES:
            continue
        if is_expected_private(path):
            continue
        problems.append("tracked but neither published nor expected private: {}".format(path))

    # 3. Local differences from what Netlify would deploy. A Netlify build
    #    works from a clean checkout of the pushed commit, so an untracked
    #    or modified file here is a local difference, not something that
    #    goes live. Reported as warnings so a stray working file does not
    #    block the check, but read them.
    warnings = []
    untracked = set(git_lines("ls-files", "--others", "--exclude-standard"))
    modified = set(
        line[3:] for line in git_lines("status", "--porcelain") if line[:2].strip() == "M"
    )
    for path in sorted(published):
        if path in untracked:
            warnings.append("untracked, copied locally, would not deploy: {}".format(path))
        elif path in modified:
            warnings.append("modified in working tree, deploy uses the commit: {}".format(path))
        elif path not in tracked:
            problems.append("published but neither tracked nor untracked (ignored?): {}".format(path))

    print("build-site: {} files in _site/".format(len(published)))
    for line in warnings:
        print("  warning: " + line)
    if problems:
        print("build-site: check FAILED")
        for line in problems:
            print("  " + line)
        sys.exit(1)
    print("build-site: check passed")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="verify after assembling")
    args = parser.parse_args()
    assemble()
    if args.check:
        check()


if __name__ == "__main__":
    main()
