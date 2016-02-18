import boto3
import botocore
import os


POLAR = 'polar-fulldump'
s3_client = boto3.client('s3')
s3 = boto3.resource('s3')
STORAGE_PLACE = "./"
def fileMaker(filename):
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        open(filename, "w").close()

# Print out bucket names
for bucket in s3.buckets.all():
    print(bucket.name)

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

objects = bucket.objects.all()
# print(dir(bucket.objects.all()))
totalSize = 0
totalDownloadedItems = 0
ItemBound = 100000
for key in bucket.objects.all():
    if key.key.endswith('/'):
        continue
    if os.path.isfile(key.key):
        continue
    totalSize += key.size
    totalDownloadedItems += 1
    print("total size of downloads ",totalSize, " /Number of download items ", totalDownloadedItems)
    fileMaker(os.path.join(STORAGE_PLACE,key.key))
    bucket.download_file(key.key,key.key)
    if totalDownloadedItems > ItemBound:
        break





'''import boto
import boto.s3.connection


access_key = 'AKIAIYQGAK2RABXX2GKA'
secret_key = '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'
POLAR = 'polar-fulldump'

conn = boto.connect_s3(
        aws_access_key_id = access_key,
        aws_secret_access_key = secret_key,
        #is_secure=False,               # uncomment if you are not using ssl
        calling_format = boto.s3.connection.OrdinaryCallingFormat(),
        )
mybucket = conn.get_bucket(POLAR)
bucketList = mybucket.list()
print(dir(bucketList))'''