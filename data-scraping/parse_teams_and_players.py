import requests
import json
from bs4 import BeautifulSoup
from pymongo import MongoClient
import time


class StorageMongoDB:
    def __init__(self, host, port, database):
        self.client = MongoClient(host, port)
        self.db = self.client[database]
        print("Connected to MongoDB database")

    def insert_club(self, club_data):
        self.db.teams.insert_one(club_data)

    def insert_player(self, player_data):
        self.db.players.insert_one(player_data)

    def find_club(self, query):
        return self.db.teams.find_one(query)

    def find_player(self, query):
        return self.db.players.find_one(query)

    def update_club(self, query, update_data):
        self.db.teams.update_one(query, {"$set": update_data})

    def count_players(self, query):
        return self.db.players.count_documents(query)


# Initialize MongoDB storage
storage_mongodb = StorageMongoDB(host="localhost", port=27017, database="footballDB")


# Load team data from JSON
data = json.load(open("teams_info.json"))

# Load HTML content
res = open("clubs.html").read()
soup = BeautifulSoup(res, "html.parser")

# Find all clubs
clubs = soup.find_all("a", class_="club-card")

for club in clubs:
    club_name = club.find("h2", class_="club-card__name").text
    club_url = club["href"]
    
    res = requests.get(club_url)
    soup = BeautifulSoup(res.text, "html.parser")

    short_name = data[club_name]["short_name"]
    logo_low = data[club_name]["logo"]
    logo_high = data[club_name]["logo_high"]

    # Add club to MongoDB if it doesn't exist
    if not storage_mongodb.find_club({"name": club_name}):
        club_data = {
            "_id": short_name,
            "name": club_name,
            "founded": '-',
            "stadium": data[club_name]["stadium"],
            "coach": " - ",  
            "logo_high": logo_high,
            "logo_low": logo_low,
            "total_player": 0
        }
        storage_mongodb.insert_club(club_data)

    # Player page
    res = requests.get(club_url)
    soup = BeautifulSoup(res.text, "html.parser")
    
    player_url = club_url.replace("/overview", "") + "/squad?se=719"
    res = requests.get(player_url)
    soup = BeautifulSoup(res.text, "html.parser")

    positions = soup.find_all("div", class_="squad-list__position-container")
    club_id = storage_mongodb.find_club({"name": club_name})["_id"]

    for position in positions:
        position_name = position.find("h1", class_="squad-list__position-header").text
        players = position.find_all("li", class_="stats-card")

        for player in players:
            try:
                first_name = player.find("div", class_="stats-card__player-first").text
                last_name = player.find("div", class_="stats-card__player-last").text
                country = player.find("span", class_="stats-card__player-country").text
                number = player.find("div", class_="stats-card__squad-number").text
                url_player = player.find("a", class_="stats-card__wrapper")["href"]

                data_player = player.find(
                    "div", class_="stats-card__player-image"
                ).find("img")["data-player"]

                avatar_url = f"https://resources.premierleague.com/premierleague/photos/players/110x140/{data_player}.png"
            except Exception as e:
                print(e)
                continue

            if first_name == "" or last_name == "" or country == "" or number == "":
                continue

            # Replace ' in name
            first_name = first_name.replace("'", "")
            last_name = last_name.replace("'", "")
            last_name = last_name.replace(" ", "")

            # Access player page to get birthdate
            try:
                res = requests.get(f"https://www.premierleague.com{url_player}")
                soup = BeautifulSoup(res.text, "html.parser")
                birthdate = (
                    soup.findAll("div", class_="player-info__info")[1]
                    .text.strip()
                    .split(" ")[0]
                )
            except Exception as e:
                print(e)
                continue

            # Insert player into MongoDB if they don't exist
            player_query = {
                "name": f"{first_name}{last_name}",
                "team": club_id,
                "position": position_name,
                "country": country,
                "number": int(number),
                "avatarUrl": avatar_url,
                "birthday": birthdate
            }

            if not storage_mongodb.find_player(player_query):
                storage_mongodb.insert_player(player_query)

    # Update total players in the club
    total_player = storage_mongodb.count_players({"team": club_id})
    storage_mongodb.update_club(
        {"_id": club_id}, {"total_player": total_player}
    )

    # time.sleep(2)