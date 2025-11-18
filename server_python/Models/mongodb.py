import pymongo
import time
MONGO_URL = "mongodb://masebav19:1723408553@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8"


class MongoClient:
    def __init__(self):
        self.client = pymongo.MongoClient(MONGO_URL)
        self.db = self.client["RedesTest"]
        self.collection = self.db["ProcessData"]
    def readAllData(self):
        cursor = self.collection.find({})
        data = list(cursor)
        for doc in data:
            if '_id' in doc:
                del doc['_id']
        return data
    def WriteData(self,data:dict):
        print(data)
        DataToWrite = data
        DataToWrite['timestamp'] = time.time()
        result = self.collection.insert_one(DataToWrite)
        return result
