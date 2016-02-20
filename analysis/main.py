

from pymongo import MongoClient
import config
from BFA  import BFAfunction,storeSig

if __name__ == '__main__':
    print("Starting to the Analysis Process")
    print("Setting up connection to Database on "+config.MONGO_URI)
    DBClient = MongoClient(config.MONGO_URI)

    DB = DBClient[config.DBNAME]
    collection = DB[config.COLLECTIONNAME]
    for type in config.TYPE:
        print("Analysis for Type "+ type)
        a =BFAfunction(type,collection)
        storeSig(type,'/home/roohy/'+type.replace('/','_'), a[0],a[1])


    DBClient.close()