import json
from bs4 import BeautifulSoup

# Load the HTML content
with open("matches.html", "r", encoding="utf-8") as file:
    content = file.read()

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(content, "html.parser")

# Find all short names
short_names = set()  # Use a set to ensure uniqueness
for span in soup.find_all("span", class_="match-fixture__short-name"):
    short_name = span.text.strip()
    short_names.add(short_name)

# Convert the set to a list
short_names_list = list(short_names)

# Save the short names to a JSON file
with open("short_names.json", "w", encoding="utf-8") as json_file:
    json.dump(short_names_list, json_file, ensure_ascii=False, indent=4)

print("Short names extracted and saved to short_names.json")