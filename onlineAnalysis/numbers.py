


from pymongo import MongoClient
from BFA import storeJSON

import config

BASE = '/home/roohy/JSONS/'

change= {'video/mpeg' : 2, 'image/gif' : 16 ,'application/rdf+xml' : 2,'image/x-ms-bmp' : 7,'audio/x-wav' : 2,'application/x-tika-msoffice' : 23, 'image/gif' : 16,
         'video/quicktime' : 6}

if __name__ == '__main__':
    print("Starting to the Analysis Process")
    print("Setting up connection to Database on "+config.MONGO_URI)
    DBClient = MongoClient(config.MONGO_URI)

    DB = DBClient[config.DBNAME]
    collection = DB[config.COLLECTIONNAME]
    result = {}
    newResult = {}
    deductions = 0
    for type in config.TYPE:
        result[type] = collection.find({'type':type}).count()
        newResult[type] = result[type]
        if type != 'application/octet-stream' and type in change:
            newResult[type] += change[type]
            deductions += change[type]
    if config.OCTET_STREAM in newResult:
        newResult[config.OCTET_STREAM] -= deductions
    storeJSON(BASE+"current_mime_type.json",result)
    storeJSON(BASE+"updated_mime_type.json",newResult)