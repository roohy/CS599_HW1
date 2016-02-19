# CS599_HW1

# S3_Downloader
S3_Connector.py file in the S3_Downloader directory will help us download files from S3 repo. To run, it needs boto3 python library
which can be installed using pip3. 
sudo pip3 install boto3

This file uses Python3 to run. 

# tika_connection

Tika connection uses Python2 and tika for python to get to know the file types in order to use them in later analysis. To access
these files later, this code stores them in a Mongo DB collection. This code snippet uses tika for Python and Pymongo. 
If you have mongo on your machine, you can use AdminMongo to manage it and add new collections to it. https://github.com/mrvautin/adminMongo

pymongo can be installed using pip. sudo pip install pymongo
