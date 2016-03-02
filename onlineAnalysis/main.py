

from pymongo import MongoClient
import config
from BFA  import BFAfunction,storeSig,storeJSON
from BFC import BFCfunction
from FHT import FHTfunction
import boto3
import botocore
import os


POLAR = 'polar-fulldump'
# s3_client = boto3.client('s3')
s3 = boto3.resource('s3')
STORAGE_PLACE = "./"


BASE = '/home/roohy/JSONS/'
if __name__ == '__main__':
    print("connecting to S3")

    bucket = s3.Bucket(POLAR)
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=POLAR)
    except botocore.exceptions.ClientError as e:
        # If a client error is thrown, then check that it was a 404 error.
        # If it was a 404 error, then the bucket does not exist.
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            exists = False

    print("Starting to the Analysis Process")
    print("Setting up connection to Database on "+config.MONGO_URI)
    DBClient = MongoClient(config.MONGO_URI)

    DB = DBClient[config.DBNAME]
    collection = DB[config.COLLECTIONNAME]
    for type in config.TYPE:
        print("Analysis for Type "+ type)
        a =BFAfunction(type,collection,bucket)
        storeSig(type,BASE+type.replace('/','_')+'_BFA', a[0],a[1])
        dfc = BFCfunction(type, collection, bucket)
        storeJSON(BASE+type.replace('/','_')+"_BFC",{'file_type':type,'analysis':'BFC','BFC':dfc})
        fht = FHTfunction(type,collection, 8, bucket)
        storeJSON(BASE+type.replace('/','_')+'_FHT_8',{'file_type':type,'analysis':'FHT-8','FHT':fht})
        fht = FHTfunction(type,collection, 16, bucket)
        storeJSON(BASE+type.replace('/','_')+'_FHT_16',{'file_type':type,'analysis':'FHT-16','FHT':fht})
        fht = FHTfunction(type,collection, 4, bucket)
        storeJSON(BASE+type.replace('/','_')+'_FHT_4',{'file_type':type,'analysis':'FHT-4','FHT':fht})

    DBClient.close()

'''
BASE = '/home/roohy/JSONS/'
if __name__ == '__main__':
    print("Starting to the Analysis Process")
    print("Setting up connection to Database on "+config.MONGO_URI)
    DBClient = MongoClient(config.MONGO_URI)

    DB = DBClient[config.DBNAME]
    collection = DB[config.COLLECTIONNAME]
    for type in config.TYPE:
        print("Analysis for Type "+ type)
        a =BFAfunction(type,collection)
        storeSig(type,BASE+type.replace('/','_')+'_BFA', a[0],a[1])
        dfc = BFCfunction(type, collection)
        storeJSON(BASE+type.replace('/','_')+"_BFC",{'file_type':type,'analysis':'BFC','BFC':dfc})
        fht = FHTfunction(type,collection, 8)
        storeJSON(BASE+type.replace('/','_')+'_FHT_8',{'file_type':type,'analysis':'FHT-8','FHT':fht})
        fht = FHTfunction(type,collection, 16)
        storeJSON(BASE+type.replace('/','_')+'_FHT_16',{'file_type':type,'analysis':'FHT-16','FHT':fht})
        fht = FHTfunction(type,collection, 4)
        storeJSON(BASE+type.replace('/','_')+'_FHT_4',{'file_type':type,'analysis':'FHT-4','FHT':fht})

    DBClient.close()


'''