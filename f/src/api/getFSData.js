function getDataFromFMP(type, arguments) { 
    const API_KEY = 'YOUR_API_KEY';
    const url = "https://financialmodelingprep.com/api/v3/${type}?apikey={API_KEY}${arguments}";
    
    fetch(url).then(resp => {
        if(!resp.ok) {
            console.log("No");
        }
        else {
            return resp.json();
        }
    });
}

function getBalanceSheetMetrics(ticker) {
    const balanceSheet = getDataFromFMP('balance-sheet-statement/${ticker}', 'period=annual');
    var totalAssets = balanceSheet[0].totalCurrentAssets + balanceSheet[0].totalNonCurrentAssets;
    var totalLiability = balanceSheet[0].totalCurrentLiabilities + balanceSheet[0].totalNonCurrentLiabilities;
    var workingCapital = balanceSheet[0].totalCurrentAssets - balanceSheet[0].totalCurrentLiabilities;
    return {
        'totalAssets': totalAssets,
        'totalLiability': totalLiability,
        'workingCapital': workingCapital
    };
}