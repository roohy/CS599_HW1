def testList(listed):
    listed2= listed
    listed2[0] = 12


listed = [1,3,4,5,6,7]
print(listed)
testList(listed)
print(listed)