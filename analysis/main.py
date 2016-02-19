

from pymongo import MongoClient
import config
from BFA import BFAfunction

if __name__ == '__main__':
    print("Starting to the Analysis Process")
    print("Setting up connection to Database on "+config.MONGO_URI)
    DBClient = MongoClient(config.MONGO_URI)

    DB = DBClient[config.DBNAME]
    collection = DB[config.COLLECTIONNAME]
    for type in config.TYPE:
        print("Analysis for Type "+ type)
        BFAfunction(type,collection)



    DBClient.close()