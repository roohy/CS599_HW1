import math
from config import ByteOrder
from boto.s3.key import Key
import json
SIGMA2_2 = 2*0.0375*0.0375
ULAW = 255
def BFAfunction(type, collection,bucket):
    typeSig = []
    coFactor = []
    tempCoFactor = []
    totalWeight = 0
    for i in range(0,256):
        typeSig.append(0)
        coFactor.append(0)
        tempCoFactor.append(0)
    flag = False
    for file in collection.find({'type':type}):
        if file['key'][-1] == '/':
            continue

        bucket.download_file(file['key'], "temp" )
        signature = byteSignature("temp")
        # print(signature)

        for i in range(0,256):
            if flag:
                diff = typeSig[i]-signature[i]
                diff *= diff
                tempCoFactor[i] = math.exp(diff/SIGMA2_2*(-1))
                coFactor[i] = ((coFactor[i]*(totalWeight-1))+tempCoFactor[i])/(totalWeight)
            typeSig[i] = ((typeSig[i]*totalWeight)+signature[i])/(totalWeight+1)

        totalWeight += 1
        flag = True
    print("Total Number of Files went through BFA: ",totalWeight)
    return [typeSig,coFactor]


def byteSignature(filePath):
    signature = []
    for i in range(0,256):
        signature.append(0)
    with open(filePath, "rb") as f:
        byte = f.read(1)
        # print(int.from_bytes(byte,ByteOrder))
        while byte != b"":
            # Do stuff with byte.
            signature[int.from_bytes(byte,ByteOrder)] += 1
            byte = f.read(1)
    maximum = float(max(signature))
    signature = [ulaw(float(x)/maximum) for x in signature]
    return signature


def storeSig(type,path,typeSig, CoFactor):
    FILE = open(path,'w')
    result = {'signature':typeSig,'corelation':CoFactor}
    FILE.write(json.dumps(result))
    FILE.close()
'''def extend(listed):
    minimum = min(list)
    maximum = max(list)
    if minimum > 0.001:
        minDiff = '''

def storeJSON(path, dic):
    FILE = open(path,'w')
    FILE.write(json.dumps(dic))
    FILE.close()


def ulaw(x,u=ULAW):
    #if zero
    return (math.copysign(1,x)*(1+u*math.fabs(x)))/(1+u)