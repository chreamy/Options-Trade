import numpy as np
import statsmodels.api as sm
import json
import requests
from api import db

def cal_slope(array):
    data = np.array(array)
    time = np.arange(1, len(data) + 1)
    X = sm.add_constant(time)
    model = sm.OLS(data, X).fit()
    negative = model.params[1]<0
    slope = round(abs(abs(model.params[1])*(len(array)-1)**(1/(len(array)-1))*100),2)
    if negative: slope = -slope
    dev = np.std(data)
    return slope

isfile = input('use list.json? (y/n): ')=='y'
if isfile:
    symbols = json.load(open('list.json','r'))
else:
    symbols = [input('Enter NYSE code: ')]
symbols = [x.lower() for x in symbols]
file = open("reports.json","r")
stocks = json.load(file)
file.close()
out = {}
file = open("calculated.json","r")
out = json.load(file)
file.close()
redb = []
#db(symbols)
for symbol in symbols:
    if symbol not in stocks:
        redb.append(symbol)
db(redb)
file = open("reports.json","r")
stocks = json.load(file)
for symbol in symbols:
    try:
        stock = stocks[symbol]
        price = json.loads(requests.get('https://financialmodelingprep.com/api/v3/quote-short/'+symbol+'?apikey=t9UwsMha0V9DQzi8tGkSQzD3WMexO05j').content)[0]['price']
        stdev = json.loads(requests.get('https://financialmodelingprep.com/api/v3/technical_indicator/daily/'+symbol+'?period=50&type=standardDeviation&apikey=t9UwsMha0V9DQzi8tGkSQzD3WMexO05j').content)[0]['standardDeviation']

        print("\n\nAnalysis Report for",symbol.upper(),'\n',''.join(['-' for x in range(len(symbol)+19)]))
        print("Price",price,end='\n\n')
        score = {"f":0,"r":0,"i":0,"e":0,"n":0,"d":0}
        slope = cal_slope(stock['eps'])
        
        slope = cal_slope(stock['cfps'])
        print("<Cash Flow per Share> ",stock["cfps"],"\nCash Flow Trend: ",slope,"%",sep='')
        if(np.mean(stock["cfps"])>0 and slope>0):score['f']=1
        slope = cal_slope(stock['roic'])
        print("<ROIC> ",stock["roic"],"\nROIC Trend: ",slope,"%",sep='')
        if(np.mean(stock["roic"])>0.1 and slope>0):score['r']=1
        print("<Interest Coverage> ",stock["interestcoverage"][-1])
        if(stock["interestcoverage"][-1]>10):score['i']=1
        elif(stock["interestcoverage"][-1]>4):score['i']=0.5
        print("<EPS> ",stock["eps"],"\nEPS Trend: ",slope,"%",sep='')
        if(np.mean(stock["eps"])>0 and slope>0):score['e']=1
        slope = cal_slope(stock['netmargin'])
        print("<Net Margin> ",stock["netmargin"],"\nNet Margin Trend: ",slope,"%",sep='')
        if(slope>0 and stock["netmargin"][-1]>0.2):score['n']=1
        elif(slope>0 or stock["netmargin"][-1]>0.1):score['n']=0.5
        if len(stock['dividend'])!=0:
            slope = cal_slope(stock['dividend'])
            print("<Dividend> ",stock["dividend"],"\nDividend Trend: ",slope,"%",sep='')
            if(np.mean(stock["dividend"])>0 and slope>0):score['d']=1
        else: print("No Dividends")

        print('\nScore: F(',score['f'],') R(',score['r'],') I(',score['i'],') E(',score['e'],') N(',score['n'],') D(',score['d'],') ',sep='')
        print("Total:",score['e']+score['d']+score['f']+score['r']+score['i']+score['n'],end='\n\n')
        growth = min(stock["1y"][-1],stock["3y"][-1] if len(stock["3y"])!=0 else 999,stock["5y"][-1] if len(stock["5y"])!=0 else 999,stock["10y"][-1] if len(stock["10y"])!=0 else 999,30)
        print("EPS Growth: ",growth,"%"+(" < 12" if growth<12 else " > 12"),sep='')
        print('Growth Evaluation: $',round(stock['eps'][-1]*max(12,growth) if stock['eps'][-1]>0 else 0,2),' (',round(stock['eps'][-1]*max(12,growth)/price*100 if stock['eps'][-1]>0 else 0,2),'%)',sep='')
        if len(stock['dividend'])!=0:
            print("\nLatest Dividend Yield: ",round(stock["dividend"][-1]/price*100,2),'%',sep='')
            print('Dividend Evaluation: $',round(stock["dividend"][-1]*25,2),' (',round(stock["dividend"][-1]*25/price*100,2),'%)',sep='')
        else:
            print('\nDividend Evaluation: $0')
        print("\nBVPS: ",stock["bvps"],sep='')
        print('Asset Evaluation: $',round(stock["bvps"]*0.8,2),' (',round(stock["bvps"]*0.8/price*100,2),'%)',sep='')
        fairprice = round(max((stock["bvps"]*0.8),(stock["dividend"][-1]*25 if len(stock['dividend'])!=0 else 0),(stock['eps'][-1]*max(12,growth) if stock['eps'][-1]>0 else 0)),2)
        print("\nCumulative Value: ",fairprice,' (',round(fairprice/price*100,2),'%) ',("BUY" if fairprice>price else "SELL"),sep='')
        
        
        
        if symbol in out:
            out.pop(symbol)
        out.update({symbol:{"price":price,"stdev":stdev/price,"score":score['e']+score['d']+score['f']+score['r']+score['i']+score['n'],"asset": round(stock["bvps"]*0.8/price*100,2),"growth":round(stock['eps'][-1]*max(12,growth)/price*100 if stock['eps'][-1]>0 else 0,2), "dividend":round((stock["dividend"][-1]*25/price*100 if len(stock['dividend'])!=0 else 0),2), "overall":round(fairprice/price*100,2)}})
    except:
         print("except")
         continue
file.close()
outfile = open("calculated.json",'w')
sorted_data = dict(sorted(out.items(), key=lambda item: item[1]["overall"], reverse=True))
sorted_data = dict(sorted(sorted_data.items(), key=lambda item: item[1]["score"], reverse=True))
outfile.write(json.dumps(sorted_data,indent=4))
outfile.close()  


