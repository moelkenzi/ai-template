#!/usr/bin/env python3
import csv
import re
import sys
from bs4 import BeautifulSoup

def extract_followers_from_html(html_content, output_csv_path="public/followers.csv"):
    """
    Parses LinkedIn Connections HTML string/file and extracts profile names
    and profile image CDN URLs into a CSV file.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    followers = []

    # Find connection cards or figure/img nodes
    cards = soup.select('[componentkey^="ConnectionCard_"]')
    
    if not cards:
        # Fallback search if outer container cards are omitted
        cards = soup.find_all("div", class_=lambda c: c and "ca7c47c8" in c)

    for card in cards:
        # Extract profile picture image src
        img = card.find("img", src=re.compile(r"licdn\.com"))
        if not img:
            continue
        pfp_url = img.get("src")

        # Extract profile name
        # Try specific paragraph text or fallback to alt attribute of img
        name_p = card.find("p", class_=lambda c: c and "_2f2992f6" in c)
        if name_p:
            name = name_p.get_text(strip=True)
        else:
            alt_text = img.get("alt", "")
            name = re.sub(r"[’']s profile picture.*", "", alt_text, flags=re.IGNORECASE).strip()

        if name and pfp_url:
            followers.append({"name": name, "pfp_url": pfp_url})

    # Write to CSV
    with open(output_csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "pfp_url"])
        writer.writeheader()
        writer.writerows(followers)

    print(f"Successfully extracted {len(followers)} profiles to {output_csv_path}")
    return followers

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        extract_followers_from_html(html)
    else:
        print("Usage: python3 extract_linkedin_followers.py <path_to_html_file>")
