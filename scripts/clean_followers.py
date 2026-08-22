import csv

def clean_and_deduplicate():
    with open("public/followers.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    unique_followers = []
    seen_names = set()

    for row in rows:
        name = row["name"].strip()
        pfp_url = row["pfp_url"].strip()
        
        # Skip single letter erroneous parses
        if len(name) <= 2:
            continue
        
        # Normalize double HTML entities
        pfp_url = pfp_url.replace("&amp;", "&")

        if name and name not in seen_names:
            seen_names.add(name)
            unique_followers.append({"name": name, "pfp_url": pfp_url})

    with open("public/followers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "pfp_url"])
        writer.writeheader()
        writer.writerows(unique_followers)

    print(f"Cleaned dataset: Total {len(unique_followers)} unique followers saved to public/followers.csv")

if __name__ == "__main__":
    clean_and_deduplicate()
