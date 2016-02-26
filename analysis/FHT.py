import math
from config import ByteOrder
import json
from BFC import cocal
SIGMA2_2 = 2*0.0375*0.0375
HEAD_SIZE = 20
TAIL_SZE = 20

def FHTfunction(type, collection,length):

    totalWeight = 0
    flag = False
    freq = makeMatrix(length)
    # co = makeMatrix(length)
    for file in collection.find({'type':type}):
        byteSignature(file['path'],freq,totalWeight,length)

        totalWeight += 1
    return freq

def makeMatrix(length):
    result = []
    for i in range(0,length):
        result.append([])
        for j in range(0,256):
            result[i].append(0)
    return result

def byteSignature(filePath,freq,weight,length):

    with open(filePath, "rb") as f:
        byte = f.read(1)
        byteCount = 0
        # print(int.from_bytes(byte,ByteOrder))
        while byte != b"":
            byteCount += 1
            byte = int.from_bytes(byte,ByteOrder)
            if byteCount > length-1:
                break
            for i in range(0,256):
                value = 0.0
                if byte == i:
                    value = 1.0

                #co[byteCount][i] = ((co[byteCount][i]*weight)+cocal(freq[byteCount][i], value))/(weight+1)
                freq[byteCount][i] = ((freq[byteCount][i]*weight)+value)/(float(weight)+1.0)

            # Do stuff with byte.
            byte = f.read(1)