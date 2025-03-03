from pymongo import MongoClient

class StorageMongoDB:
    def __init__(self, host, port, database):
        self.client = MongoClient(host, port)
        self.db = self.client[database]
        print("Connected to MongoDB database")

    def update_player_names(self):
        players = self.db.players.find()
        for player in players:
            trimmed_first_name = player['first_name'].strip()
            trimmed_last_name = player['last_name'].strip()
            if player['first_name'] != trimmed_first_name or player['last_name'] != trimmed_last_name:
                self.db.players.update_one(
                    {'_id': player['_id']},
                    {'$set': {'first_name': trimmed_first_name, 'last_name': trimmed_last_name}}
                )
                print(f"Updated player: {player['_id']} - {trimmed_first_name} {trimmed_last_name}")

# Initialize the MongoDB connection
storage_mongodb = StorageMongoDB(
    host="localhost",
    port=27017,
    database="footballDB"
)

# Update player names
storage_mongodb.update_player_names()