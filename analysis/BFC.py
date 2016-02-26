import math
from config import ByteOrder
import json
from BFA import byteSignature
SIGMA2_2 = 2*0.0375*0.0375

def cocal(avg, new,ARGSIGMA=SIGMA2_2): #correlation calculator
    diff = avg-new
    diff*=diff
    return math.exp(-1*diff/ARGSIGMA)

def BFCfunction(type, collection):
    typeSig = []
    coFactor = []
    tempCoFactor = []
    totalWeight = 0
    for i in range(0,256):
        typeSig.append(0)
        coFactor.append(0)
        tempCoFactor.append(0)
    flag = False
    dfc = []
    for file in collection.find({'type':type}):
        signature = byteSignature(file['path'])
        if flag:
            mergeDFC(dfc, signature, totalWeight)
        else:
            dfc = crossCorrelation(signature)
        totalWeight += 1

    print("Total Number of Files went through BFC: ",totalWeight)
    return dfc

def crossCorrelation(signature):
    result = []
    for i in range(0,256):
        result.append([])
        for j in range(0,256):
            if i<j:
                result[i].append(signature[j]-signature[i])
            else:
                result[i].append(0)
    return result


def mergeDFC(dfc, signature,weight):
    for i in range(0,256):
        for j in range(i+1,256):
            sigIJ = signature[j]-signature[i]
            #if post processing on signatures needed do it here on sigIJ
            dfc[j][i] = cocal(dfc[i][j],sigIJ)
            dfc[i][j] = ((dfc[i][j]*weight)+sigIJ)/(weight+1)

            # dfc[j][i] =