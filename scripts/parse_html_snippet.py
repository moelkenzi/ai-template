import re
import csv

def process_raw_snippet_native():
    with open("scripts/raw_html.txt", "r", encoding="utf-8") as f:
        html = f.read()

    # Read existing entries
    existing_followers = []
    seen_names = set()

    try:
        with open("public/followers.csv", "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row["name"].strip()
                if name and name not in seen_names:
                    seen_names.add(name)
                    existing_followers.append({"name": name, "pfp_url": row["pfp_url"].strip()})
    except FileNotFoundError:
        pass

    # Extract img tags and alt/src attributes using regex
    # Pattern to match profile alt text and profile photo url
    img_matches = re.findall(
        r'alt="([^"]+?)(?:’s profile picture|&#39;s profile picture)?[^"]*"[^\>]*?src="(https://media\.licdn\.com/dms/image/[^"]+)"',
        html,
        re.IGNORECASE
    )

    new_added = 0
    for raw_name, pfp_url in img_matches:
        name = raw_name.replace("’s profile picture", "").replace("'s profile picture", "").replace(", open to work", "").strip()
        if name and name not in seen_names:
            seen_names.add(name)
            existing_followers.append({"name": name, "pfp_url": pfp_url})
            new_added += 1

    with open("public/followers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "pfp_url"])
        writer.writeheader()
        writer.writerows(existing_followers)

    print(f"Total unique followers count: {len(existing_followers)} (Added {new_added} new entries)")

if __name__ == "__main__":
    process_raw_snippet_native()
