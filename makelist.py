import requests
from api import db
import json

url = "https://financialmodelingprep.com/api/v3/stock/list"
APIkey='?apikey=90449c63998514b28abd312885a78779'
fullurl = url+ APIkey
data = json.loads(requests.get(fullurl).content)
lst = []
for x in data:
    if x['exchangeShortName'] == 'NYSE' or x['exchangeShortName'] == 'NASDAQ':
        lst.append(x['symbol'])
#lst = [x['symbol'] for x in data]
file = open("list.json",'w')
file.write(json.dumps(lst))
file.close()