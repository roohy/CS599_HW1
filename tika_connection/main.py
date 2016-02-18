
import tika
import os
from tika import parser
from pymongo import MongoClient


tika.initVM()
rootDIR = "/home/roohy/PycharmProjects/CS599_HW1/S3_Downloader"
mongoDIR = 'mongodb://admin:admin123@localhost:27017'

def get_filepaths(directory):
    """
    This function will generate the file names in a directory
    tree by walking the tree either top-down or bottom-up. For each
    directory in the tree rooted at directory top (including top itself),
    it yields a 3-tuple (dirpath, dirnames, filenames).
    """
    file_paths = []  # List which will store all of the full filepaths.

    # Walk the tree.
    for root, directories, files in os.walk(directory):
        for filename in files:
            # Join the two strings in order to form the full filepath.
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)  # Add it to the list.

    return file_paths  # Self-explanatory.

# Run the above function and store its results in a variable.
full_file_paths = get_filepaths(rootDIR)

#setting up db connection
client = MongoClient(mongoDIR)
db = client['CS599_HW1']


totalNum = 0
totalErrors = 0
totalPosts= []
totalErrorPath = []
for path in full_file_paths:
    totalNum +=1
    #print path
    try:
        parsed = parser.from_file(path)
        # print "-------------------------------------------------------------------------------------------"
        # print(path)
        contentType =  parsed['metadata']['Content-Type']
        list = contentType.split("; ")
        type_list = list[0].split('/')
        #print list
        #print new_list
        post = {
            'path': path,
            'type': str(type_list[0]),
            'subType': str(type_list[1])
        }
        if len(list) > 1:
            post['additional'] = str(list[1])
        totalPosts.append(post)
        # post_id = posts.insert_one(post).inserted_id
        # print post
    except:
        totalErrors += 1
        print "An error happened"
        errorPath = {'path': path}
        totalErrorPath.append(errorPath)
posts = db.posts
errors = db.errorPath
errors.insert_many(totalErrorPath)
result = posts.insert_many(totalPosts)
print "total number of paths"+str(totalNum)
print "total number of errorss"+str(totalErrors)