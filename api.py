import requests
import json
import numpy as np

curryear = 2023
def db(stocks):
    file = open("reports.json","r")
    out = json.load(file)
    file.close()
    for stock in stocks:
        res = requests.get('https://financialmodelingprep.com/api/v3/income-statement/'+stock+'?apikey=90449c63998514b28abd312885a78779')
        data = json.loads(res.content)
        epslist = [x["epsdiluted"] for x in data]
        epslist.reverse()
        yearly = [round(((epslist[i]/epslist[i-1])-1)*100,2) if epslist[i-1]!=0 else '-' for i in range(1,len(epslist))][-10:]
        if len(epslist)>4:
            triyearly = [round(abs((epslist[i]/epslist[i-3])**(0.33).real-1)*100,2) if epslist[i-3] else '-' for i in range(1,len(epslist))][-10:]
        else:
            triyearly = []
        if len(epslist)>6:
            fiveyearly = [round(abs((epslist[i]/epslist[i-5])**(0.2).real-1)*100,2) if epslist[i-5] else '-' for i in range(1,len(epslist))][-10:]
        else:
            fiveyearly = []
        if len(epslist)>11:
            tenyearly = [round(abs((epslist[i]/epslist[i-10])**(0.1).real-1)*100,2) if epslist[i-10] else '-' for i in range(1,len(epslist))][-10:]
        else:
            tenyearly = []
        res = requests.get('https://financialmodelingprep.com/api/v3/key-metrics-ttm/'+stock+'?limit=40&apikey=90449c63998514b28abd312885a78779')
        data = json.loads(res.content)
        bvps=data[0]["bookValuePerShareTTM"]

        res = requests.get("https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/"+stock+"?apikey=90449c63998514b28abd312885a78779")
        data = json.loads(res.content)
        data["historical"].reverse()
        dividendlist = [x["adjDividend"] for x in data["historical"]]
        dividendbyyear = []
        if len(dividendlist)>0:
            index = 0
            sum = 0
            year = data["historical"][0]["date"][:4]
            while year != curryear and index < len(dividendlist):
                if data["historical"][index]["date"][:4]==year:
                    sum+=data["historical"][index]["adjDividend"]
                else:
                    dividendbyyear.append(round(sum,4))
                    sum=data["historical"][index]["adjDividend"]
                    year = data["historical"][index]["date"][:4]
                index+=1

        if len(dividendlist)>=4:
            dividendTTM = np.sum(dividendlist[-4:]) 
            dividendbyyear.append(dividendTTM)

        res = requests.get('https://financialmodelingprep.com/api/v3/ratios/'+stock+'?limit=40&apikey=90449c63998514b28abd312885a78779')
        data = json.loads(res.content)
        freecash = [round(float(x["freeCashFlowPerShare"]),2) if x["freeCashFlowPerShare"] else 0 for x in data]
        freecash.reverse()
        roe = [round(float(x["returnOnEquity"]),2) if x["returnOnEquity"] else 0 for x in data]
        roe.reverse()
        interest = [round(float(x["interestCoverage"]),2) if x["interestCoverage"] else 0 for x in data]
        interest.reverse()

        if stock in out:
                out.pop(stock)
        out.update({stock:{"bvps": round(bvps,4),"cfps":freecash[-10:], "dividend":dividendbyyear[-10:], "interestcoverage":interest[-10:], "roe":roe[-10:], "eps": epslist[-10:], "1y": yearly, "3y": triyearly, "5y": fiveyearly, "10y": tenyearly}})
    file = open("reports.json","w")
    file.write(json.dumps(out,indent=4))
    file.close()    