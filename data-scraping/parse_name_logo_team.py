from bs4 import BeautifulSoup
import json

# Load the short names from the JSON file
with open("short_names.json", "r") as file:
    short_names = json.load(file)

content = open("teams_info.txt").read()
soup = BeautifulSoup(content, "html.parser")
results = {}

# find all img tags
imgs = soup.find_all("img")
names = soup.find_all("div", class_="team-index__club-name")
stadium = soup.find_all("div", class_="team-index__stadium-name u-show-mob")

for img, name, stadium in zip(imgs, names, stadium):
    team = {}
    team_name = name.get_text()
    team["name"] = team_name
    team["logo"] = img["srcset"].split(",")[0].split(" ")[0]
    team["logo_high"] = img["srcset"].split(",")[1].split(" ")[1]
    team["short_name"] = short_names[team_name]
    team["stadium"] = stadium.get_text()
    results[team["name"]] = team

# Save the results to a JSON file
file_name = "teams_info.json"
with open(file_name, "w") as file:
    json.dump(results, file, indent=4)

print("Teams information has been updated and saved to", file_name)
