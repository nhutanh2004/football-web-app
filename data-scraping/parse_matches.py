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

def get_scorers(match_url):
    response = requests.get(match_url)
    soup = BeautifulSoup(response.content, "html.parser")
    scorers = []

    events = soup.find_all("div", class_="mc-summary__event")
    for event in events:
        scorer_ele = event.find("a", class_="mc-summary__scorer")
        if scorer_ele:
            first_name_ele = scorer_ele.find("div", class_="mc-summary__scorer-name-first")
            last_name_ele = scorer_ele.find("div", class_="mc-summary__scorer-name-last")
            if first_name_ele and last_name_ele:
                first_name = first_name_ele.text.strip()
                last_name = last_name_ele.text.strip()
                full_name = f"{first_name} {last_name}"
                scorers.append(full_name)
            elif first_name_ele:
                first_name = first_name_ele.text.strip()
                scorers.append(first_name)
            elif last_name_ele:
                last_name = last_name_ele.text.strip()
                scorers.append(last_name)
            else:
                print("No scorer found")
                continue
            
    return scorers

def get_matches():
    content = open("matches_2024-2025.html", "r").read()
    soup = BeautifulSoup(content, "html.parser")

    dates = soup.find_all("div", class_="fixtures__date-container")

    # match_count = 0  # Counter to limit to two matches

    for date_ele in dates:
        matches = date_ele.find_all("div", class_="match-fixture__wrapper")
        time_ele = date_ele.find("time", class_="fixtures__date fixtures__date--long")

        date_str = time_ele.text.strip()
        date = datetime.strptime(date_str, "%A %d %B %Y")

        for match in matches:
            # if match_count >= 2:
            #     return  # Stop after processing two matches

            teams = match.find_all("span", class_="match-fixture__short-name")
            score_ele = match.find("span", class_="match-fixture__score")
            stadium_ele = match.find("span", class_="match-fixture__stadium-name")
            match_url = "https:" + match["data-href"]

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

            players1 = storage_mongodb.find_players(team1_id)
            players2 = storage_mongodb.find_players(team2_id)

            if len(players1) == 0 or len(players2) == 0:
                print(f"No players found for teams: {team1 if len(players1) == 0 else team2}")
                continue

            scorers = get_scorers(match_url)
            print(f"Scorers: {scorers}")

            match_data = {
                "_id": ObjectId(), 
                "date": date,
                "team1": team1_id,
                "team2": team2_id,
                "score": f"{score1}-{score2}",
                "stadium": stadium,
                "status": "completed",
                "scorer": scorers,  
            }

            try:
                storage_mongodb.insert_match(match_data)
            except Exception as e:
                print(f"Failed to insert match data: {match_data}")
                print(f"Error: {e}")

            # match_count += 1  # Increment the match counter

get_matches()