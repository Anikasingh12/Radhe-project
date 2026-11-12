#!/usr/bin/env python3
"""Compare live radheex.com images with the r777 project and pull the missing ones.

Usage:
    python3 scripts/pull_images.py <live_urls.txt> [--all]

live_urls.txt  one image URL per line (collected from https://www.radheex.com/home)
--all          download every image: live site + every URL the project hot-links

Downloads go to public/images/<cdn-host>/<cdn-path>, mirroring the CDN layout.
Files that already exist locally are compared by SHA-256 against the live copy
and re-downloaded only if they differ.
"""
import hashlib
import re
import sys
from concurrent.futures import ThreadPoolExecutor
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

PROJECT = Path(__file__).resolve().parent.parent
OUT_DIR = PROJECT / "public" / "images"
IMG_RE = re.compile(r"https?://[^\"'\s)`]+?\.(?:png|jpe?g|webp|gif|svg|avif|ico)", re.I)
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36"}


def project_image_urls():
    urls = set()
    for f in [PROJECT / "index.html", *(PROJECT / "src").rglob("*")]:
        if f.is_file() and f.suffix in {".html", ".js", ".jsx", ".ts", ".tsx", ".css", ".json"}:
            urls.update(IMG_RE.findall(f.read_text(errors="ignore")))
    return urls


def local_path(url):
    u = urlparse(url)
    return OUT_DIR / u.netloc / u.path.lstrip("/")


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


def pull(url):
    """Download url into the project. Returns 'new', 'updated', 'same' or 'error: ...'."""
    dest = local_path(url)
    try:
        data = fetch(url)
    except Exception as e:  # noqa: BLE001
        return f"error: {e}"
    if dest.exists():
        if hashlib.sha256(dest.read_bytes()).digest() == hashlib.sha256(data).digest():
            return "same"
        status = "updated"
    else:
        status = "new"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return status


def main():
    live = {l.strip() for l in Path(sys.argv[1]).read_text().splitlines() if l.strip()}
    live = {u.split("?")[0] for u in live if IMG_RE.fullmatch(u.split("?")[0])}
    proj = project_image_urls()

    in_both = live & proj
    missing = live - proj
    print(f"live site images:        {len(live)}")
    print(f"project image refs:      {len(proj)}")
    print(f"already in project:      {len(in_both)}")
    print(f"missing from project:    {len(missing)}")

    targets = sorted(live | proj) if "--all" in sys.argv else sorted(missing)
    counts = {}
    with ThreadPoolExecutor(max_workers=12) as pool:
        for url, s in zip(targets, pool.map(pull, targets)):
            counts[s.split(":")[0]] = counts.get(s.split(":")[0], 0) + 1
            print(f"  [{s}] {url}")
    print("result:", counts, "->", OUT_DIR)


if __name__ == "__main__":
    main()
