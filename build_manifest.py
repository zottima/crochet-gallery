"""
Scans the images/ folder and writes manifest.json.

Run this locally (or let the GitHub Action run it) any time images
are added, removed or renamed. It does not touch the image files
themselves, it only lists them.

Usage:
    python build_manifest.py
"""

import datetime
import json
import os

IMAGES_FOLDER = "images"
MANIFEST_FILE = "manifest.json"
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]


def make_title(filename):
    # turns "01-blue-octopus-amigurumi.jpg" into "Blue Octopus Amigurumi"
    # the leading number is only used for sort order, not shown in the title
    name_without_extension = os.path.splitext(filename)[0]
    words = name_without_extension.replace("_", " ").replace("-", " ").split()

    # drop a leading ordering number, e.g. "01" in "01 blue octopus amigurumi"
    if len(words) > 0 and words[0].isdigit():
        words = words[1:]

    title = " ".join(words)
    return title


def main():
    all_files = os.listdir(IMAGES_FOLDER)
    all_files.sort()

    entries = []
    for filename in all_files:
        extension = os.path.splitext(filename)[1].lower()
        if extension in ALLOWED_EXTENSIONS:
            entry = {
                "file": filename,
                "title": make_title(filename),
            }
            entries.append(entry)

    today = datetime.date.today()
    manifest = {
        "generated_at": today.strftime("%d %B %Y"),
        "pieces": entries,
    }

    with open(MANIFEST_FILE, "w", encoding="utf-8") as manifest_file:
        json.dump(manifest, manifest_file, indent=2, ensure_ascii=False)

    print("Wrote " + str(len(entries)) + " images to " + MANIFEST_FILE)


if __name__ == "__main__":
    main()
