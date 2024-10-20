tickers = []

with open("b/sp500.txt", "r") as r:
    for line in r.readlines():
        linestr = line.split('	')
        tickers.append(linestr[2])

with open("b/sp500.json", "w") as w:
    w.write(str(tickers).replace("'", "\""))