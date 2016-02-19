
from config import ByteOrder


def BFAfunction(type, collection):
    typeSig = []
    for i in range(0,256):
        typeSig.append(0)
    for file in collection.find({'type':type}):
        signature = byteSignature(file['path'])
        # print(signature)



def byteSignature(filePath):
    signature = []
    for i in range(0,256):
        signature.append(0)
    with open(filePath, "rb") as f:
            byte = f.read(1)
            print(int.from_bytes(byte,ByteOrder))
            while byte != b"":
                # Do stuff with byte.
                signature[int.from_bytes(byte,ByteOrder)] += 1
                byte = f.read(1)
    return signature