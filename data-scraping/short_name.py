import json

# Load the existing JSON file
with open('teams_info.json', 'r') as file:
    teams_info = json.load(file)

# Extract short names
short_names = {team: info['short_name'] for team, info in teams_info.items()}

# Write the short names to a new JSON file
with open('short_name.json', 'w') as file:
    json.dump(short_names, file, indent=4)

print("Short names have been extracted and saved to short_names.json")