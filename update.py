from api import db
import json

file = open('calculated.json','r')
data=json.load(file)
lst = [x for x in data]
file.close()
file = open('list.json','w')
file.write(json.dumps(lst))
file.close()