import requests
import json
import random
from bs4 import BeautifulSoup
import time
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

class StorageMongoDB:
    def __init__(self, host, port, database):
        self.client = MongoClient(host, port)
        self.db = self.client[database]
        print("Connected to MongoDB database")

    def insert_match(self, match_data):
        self.db.matches.insert_one(match_data)

    def find_team(self, team_name):
        return self.db.teams.find_one({"_id": team_name})

    def find_players(self, team_id):
        return list(self.db.players.find({"team": team_id}))
    
    def find_scorer(self, name):
        query = {"name": name}
        return self.db.players.find_one(query)

storage_mongodb = StorageMongoDB(
    host="localhost",
    port=27017,
    database="footballDB"
)

mapping_team = {
    "Everton": "EVE",
    "Bournemouth": "BOU",
    "Fulham": "FUL",
    "Chelsea": "CHE",
    "Newcastle" : "NEW","Newcastle United": "NEW",
    "Brentford": "BRE",
    "Ipswich": "IPS","Ipswich Town": "IPS",
    "Nott'm Forest": "NOT","Nottingham Forest": "NOT",
    "Crystal Palace": "CRY",
    "West Ham": "WHU","West Ham United": "WHU",
    "Man City": "MCI","Manchester City": "MCI",
    "Southampton": "SOU",
    "Wolves": "WOL","Wolverhampton Wanderers": "WOL",
    "Aston Villa": "AVL",
    "Man Utd": "MUN","Manchester United": "MUN",
    "Brighton": "BHA","Brighton & Hove Albion": "BHA",
    "Spurs": "TOT","Tottenham Hotspur": "TOT",
    "Arsenal": "ARS",
    "Liverpool": "LIV",
    "Leicester": "LEI","Leicester City": "LEI"
}

def get_scorers(match_url, team1, team2):
    response = requests.get(match_url)
    soup = BeautifulSoup(response.content, "html.parser")
    scorers = {
        "team1_scorer": [],  # Scored for team1 (home)
        "team2_scorer": []   # Scored for team2 (away)
    }

    # Handle home (team1) scorers
    home_events = soup.find("div", class_="matchEvents matchEventsContainer home")
    if home_events:
        events = home_events.find_all("div", class_="mc-summary__event")
        for event in events:
            scorer_name, minute, own_goal = extract_event_details(event, team1)
            if scorer_name:
                scorers["team1_scorer"].append({
                    "scorerId": find_scorer_id(scorer_name),
                    "minute": minute,
                    "ownGoal": own_goal
                })

    # Handle away (team2) scorers
    away_events = soup.find("div", class_="matchEvents matchEventsContainer away")
    if away_events:
        events = away_events.find_all("div", class_="mc-summary__event")
        for event in events:
            scorer_name, minute, own_goal = extract_event_details(event, team2)
            if scorer_name:
                scorers["team2_scorer"].append({
                    "scorerId": find_scorer_id(scorer_name),
                    "minute": minute,
                    "ownGoal": own_goal
                })

    return scorers


def extract_event_details(event, scoring_team):
    """Extract scorer details, including minute and own goal detection."""
    minute_ele = event.find("span", class_="mc-summary__event-time")
    scorer_ele = event.find("a", class_="mc-summary__scorer")
    icon_ele = minute_ele.find("img") if minute_ele else None

    # Get scoring minute
    minute_text = minute_ele.text.strip().replace("'", "") if minute_ele else None
    minute = int(minute_text) if minute_text and minute_text.isdigit() else None

    # Extract scorer name
    first_name_ele = scorer_ele.find("div", class_="mc-summary__scorer-name-first") if scorer_ele else None
    last_name_ele = scorer_ele.find("div", class_="mc-summary__scorer-name-last") if scorer_ele else None
    first_name = first_name_ele.text.strip() if first_name_ele else ""
    last_name = last_name_ele.text.strip() if last_name_ele else ""
    first_name = first_name.replace("'", "")
    last_name = last_name.replace("'", "")
    last_name = last_name.replace(" ", "")
    scorer_name = f"{first_name} {last_name}".strip()

    # Detect own goal based on icon
    own_goal = False
    if icon_ele and "og-w" in icon_ele["src"]:  # Own goal detected
        own_goal = True

    return scorer_name, minute, own_goal


def find_scorer_id(name):
    """Fetch scorer ID from the database."""
    scorer_doc = storage_mongodb.find_scorer(name)
    return scorer_doc["_id"] if scorer_doc else None

def get_kickoff_time(match_url, retries=3, delay=15):
    """Extracts the kickoff time from the match page with retry logic."""
    for attempt in range(retries):
        response = requests.get(match_url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Locate the element containing the kickoff time
        kickoff_ele = soup.find("span", class_="renderKOContainer")
        if kickoff_ele:
            # Extract Unix timestamp from `data-kickoff`
            kickoff_timestamp = kickoff_ele.get("data-kickoff")
            if kickoff_timestamp:
                # Convert Unix timestamp to datetime
                timestamp = int(kickoff_timestamp) / 1000  # Convert milliseconds to seconds
                readable_time = datetime.fromtimestamp(timestamp)
                print(f"Converted Kickoff Time: {readable_time}")
                return readable_time.strftime('%d-%m-%Y %H:%M:%S')
            else:
                print("Kickoff timestamp not found in data-kickoff.")
                return None
        else:
            print(f"Kickoff element not found. Attempt {attempt + 1} of {retries}. Retrying in {delay} seconds...")
            time.sleep(delay)  # Wait before retrying

    print("Max retries reached. Kickoff time could not be retrieved.")
    return None



def get_matches():
    content = open("matches_2024-2025.html", "r").read()
    soup = BeautifulSoup(content, "html.parser")

    dates = soup.find_all("div", class_="fixtures__date-container")

    # match_count = 0  # Counter to limit to two matches

    for date_ele in dates:
        matches = date_ele.find_all("div", class_="match-fixture__wrapper")
        time_ele = date_ele.find("time", class_="fixtures__date fixtures__date--long")

        date_str = time_ele.text.strip()
        

        for match in matches:
            
            # if match_count >= 2:
                # return  # Stop after processing two matches

            teams = match.find_all("span", class_="match-fixture__short-name")
            score_ele = match.find("span", class_="match-fixture__score")
            stadium_ele = match.find("span", class_="match-fixture__stadium-name")
            match_url = "https:" + match["data-href"]
            kickoff_time = get_kickoff_time(match_url)  # Call the function to get the time
            datetime_str = f"{kickoff_time}"
            date = datetime.strptime(datetime_str, "%d-%m-%Y %H:%M:%S")  # Parse into datetime

            team1 = mapping_team.get(teams[0].text, teams[0].text)
            team2 = mapping_team.get(teams[1].text, teams[1].text)
            score1 = int(score_ele.text.split("-")[0])
            score2 = int(score_ele.text.split("-")[1])
            stadium = stadium_ele.text.strip() if stadium_ele else "Unknown"

            print(f"Processing match: {team1} vs {team2} with score {score1}-{score2} at {stadium}")
            print(f"Match URL: {match_url}")

            team1_doc = storage_mongodb.find_team(team1)
            team2_doc = storage_mongodb.find_team(team2)

            if not team1_doc or not team2_doc:
                print(f"Team not found: {team1 if not team1_doc else team2}")
                continue

            team1_id = team1_doc["_id"]
            team2_id = team2_doc["_id"]

            scorers = get_scorers(match_url, team1, team2)
            # print(f"Team 1 Scorers: {scorers['team1_scorer']}")
            # print(f"Team 2 Scorers: {scorers['team2_scorer']}")

            match_data = {
                "_id": ObjectId(), 
                "date": date,
                "team1": team1_id,
                "team2": team2_id,
                "score": f"{score1}-{score2}",
                "stadium": stadium,
                "status": "completed",
                "team1_scorer": scorers["team1_scorer"],  
                "team2_scorer": scorers["team2_scorer"],  
            }

            try:
                storage_mongodb.insert_match(match_data)
            except Exception as e:
                print(f"Failed to insert match data: {match_data}")
                print(f"Error: {e}")

            # match_count += 1  # Increment the match counter
        time.sleep(1)

get_matches()