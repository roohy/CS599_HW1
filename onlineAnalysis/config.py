
MONGO_URI = 'mongodb://admin:admin123@localhost:27017'
DBNAME = "CS599_HW1"
COLLECTIONNAME = 'files'
ByteOrder = 'little'
OCTET_STREAM = 'application/octet-stream'
TYPE = ["application/rdf+xml", "video/mpeg","application/atom+xml","application/x-compress",
        "application/x-msdownload", "application/x-tika-msoffice", "image/vnd.microsoft.icon"]#, 'application/rss+xml','application/rdf+xml']#'application/pdf']
TYPE += ['image/x-ms-bmp','video/quicktime','video/x-m4v','video/x-msvideo','xscapplication/zip',"image/gif",'image/svg+xml',OCTET_STREAM]
TYPE += ['audio/x-wav']
