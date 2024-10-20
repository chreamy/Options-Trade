const express = require("express");
const OpenAI = require("openai");
require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const calculated = require("./calculated");
const { reports } = require("./reports");
const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware and allow all origins
app.use(cors());
app.use(express.json());

context = `
    You are a financial assistant named Schwab Bot tasked with helping users. You are NOT ALLOWED
    to divert from a financial discussion. If a user tries to divert attention away from a topic not 
    related to the field of finance, politely tell them that you are restricted to financial topics only. 
    That said, you are incredibly knowledgeable about finance, and capable of brilliantly clear explanations
    to any financial questions. 
    `;

async function getResponse(message) {
  const key = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: key });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: context },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content;
}

async function getDataFromFMP(typ, arg = "") {
  const API_KEY = process.env.FREE_STOCK_MARKET_API_KEY;
  const url = `https://financialmodelingprep.com/api/v3/${typ}?apikey=${API_KEY}&${arg}`;
  const resp = await fetch(url);

  return await resp.json();
}

async function getMetrics(symbol) {
  try {
    // Balance sheet
    const bs = await getDataFromFMP(
      `balance-sheet-statement/${symbol}`,
      "period=annual"
    ).then((dataFromFMP) => {
      return {
        totalAssets:
          Math.round(
            ((dataFromFMP[0]["totalCurrentAssets"] +
              dataFromFMP[0]["totalNonCurrentAssets"]) /
              1000000) *
              100
          ) / 100,
        totalCurrentAssets:
          Math.round((dataFromFMP[0]["totalCurrentAssets"] / 1000000) * 100) /
          100,
        totalLiabilities:
          Math.round(
            ((dataFromFMP[0]["totalCurrentLiabilities"] +
              dataFromFMP[0]["totalNonCurrentLiabilities"]) /
              1000000) *
              100
          ) / 100,
        totalCurrentLiabilities:
          Math.round(
            (dataFromFMP[0]["totalCurrentLiabilities"] / 1000000) * 100
          ) / 100,
        totalStockholdersEquity:
          Math.round(
            (dataFromFMP[0]["totalStockholdersEquity"] / 1000000) * 100
          ) / 100,
        goodwill:
          Math.round((dataFromFMP[0]["goodwill"] / 1000000) * 100) / 100,
        workingCapital:
          Math.round(
            ((dataFromFMP[0]["totalCurrentAssets"] -
              dataFromFMP[0]["totalCurrentLiabilities"]) /
              1000000) *
              100
          ) / 100,
      };
    });
    // Balance sheet change
    const bsc = await getDataFromFMP(
      `balance-sheet-statement-growth/${symbol}`
    ).then((dataFromFMP) => {
      return {
        growthTotalCurrentAssets: dataFromFMP[0]["growthTotalCurrentAssets"],
        growthTotalCurrentLiabilities:
          dataFromFMP[0]["growthTotalCurrentLiabilities"],
      };
    });
    // DCF
    const dcf = await getDataFromFMP(`discounted-cash-flow/${symbol}`).then(
      (dataFromFMP) => {
        return {
          intrinsicValue: dataFromFMP[0]["dcf"],
          marketValue: dataFromFMP[0]["Stock Price"],
        };
      }
    );
    // Key metrics
    const kme = await getDataFromFMP(`key-metrics-ttm/${symbol}`).then(
      (dataFromFMP) => {
        return {
          earningsYield: dataFromFMP[0]["earningsYieldTTM"],
          dividendYield: dataFromFMP[0]["dividendYieldTTM"],
        };
      }
    );
    // Key ratios
    const kra = await getDataFromFMP(`ratios-ttm/${symbol}`).then(
      (dataFromFMP) => {
        return {
          returnOnAssets: dataFromFMP[0]["returnOnAssetsTTM"],
          returnOnEquity: dataFromFMP[0]["returnOnEquityTTM"],
        };
      }
    );
    return { ...bs, ...bsc, ...dcf, ...kme, ...kra };
  } catch (error) {
    console.error(error);
  }
}

async function getReport(symbol) {
  try {
    // Balance sheet
    const bs = await getDataFromFMP(
      `balance-sheet-statement/${symbol}`,
      "period=annual"
    ).then((dataFromFMP) => {
      return {
        totalAssets:
          Math.round(
            ((dataFromFMP[0]["totalCurrentAssets"] +
              dataFromFMP[0]["totalNonCurrentAssets"]) /
              1000000) *
              100
          ) / 100,
        totalCurrentAssets:
          Math.round((dataFromFMP[0]["totalCurrentAssets"] / 1000000) * 100) /
          100,
        totalLiabilities:
          Math.round(
            ((dataFromFMP[0]["totalCurrentLiabilities"] +
              dataFromFMP[0]["totalNonCurrentLiabilities"]) /
              1000000) *
              100
          ) / 100,
        totalCurrentLiabilities:
          Math.round(
            (dataFromFMP[0]["totalCurrentLiabilities"] / 1000000) * 100
          ) / 100,
        totalStockholdersEquity:
          Math.round(
            (dataFromFMP[0]["totalStockholdersEquity"] / 1000000) * 100
          ) / 100,
        goodwill:
          Math.round((dataFromFMP[0]["goodwill"] / 1000000) * 100) / 100,
        workingCapital:
          Math.round(
            ((dataFromFMP[0]["totalCurrentAssets"] -
              dataFromFMP[0]["totalCurrentLiabilities"]) /
              1000000) *
              100
          ) / 100,
      };
    });
    // Balance sheet change
    const bsc = await getDataFromFMP(
      `balance-sheet-statement-growth/${symbol}`
    ).then((dataFromFMP) => {
      return {
        growthTotalCurrentAssets: dataFromFMP[0]["growthTotalCurrentAssets"],
        growthTotalCurrentLiabilities:
          dataFromFMP[0]["growthTotalCurrentLiabilities"],
      };
    });
    // DCF
    const dcf = await getDataFromFMP(`discounted-cash-flow/${symbol}`).then(
      (dataFromFMP) => {
        return {
          intrinsicValue: dataFromFMP[0]["dcf"],
          marketValue: dataFromFMP[0]["Stock Price"],
        };
      }
    );
    // Key metrics
    const kme = await getDataFromFMP(`key-metrics-ttm/${symbol}`).then(
      (dataFromFMP) => {
        return {
          earningsYield: dataFromFMP[0]["earningsYieldTTM"],
          dividendYield: dataFromFMP[0]["dividendYieldTTM"],
        };
      }
    );
    // Key ratios
    const kra = await getDataFromFMP(`ratios-ttm/${symbol}`).then(
      (dataFromFMP) => {
        return {
          totalAssets:
            Math.round(
              ((dataFromFMP[0]["totalCurrentAssets"] +
                dataFromFMP[0]["totalNonCurrentAssets"]) /
                1000000) *
                100
            ) / 100,
          totalCurrentAssets:
            Math.round((dataFromFMP[0]["totalCurrentAssets"] / 1000000) * 100) /
            100,
          totalLiabilities:
            Math.round(
              ((dataFromFMP[0]["totalCurrentLiabilities"] +
                dataFromFMP[0]["totalNonCurrentLiabilities"]) /
                1000000) *
                100
            ) / 100,
          totalCurrentLiabilities:
            Math.round(
              (dataFromFMP[0]["totalCurrentLiabilities"] / 1000000) * 100
            ) / 100,
          totalStockholdersEquity:
            Math.round(
              (dataFromFMP[0]["totalStockholdersEquity"] / 1000000) * 100
            ) / 100,
          goodwill:
            Math.round((dataFromFMP[0]["goodwill"] / 1000000) * 100) / 100,
          workingCapital:
            Math.round(
              ((dataFromFMP[0]["totalCurrentAssets"] -
                dataFromFMP[0]["totalCurrentLiabilities"]) /
                1000000) *
                100
            ) / 100,
          ...calculated["calculated"][symbol.toLowerCase()],
          ...reports[symbol.toLowerCase()],
        };
      }
    );
    // Reporting by ChatGPT
    const report = await getNews(symbol).then(async (newsResponse) => {
      const fsReport = await getResponse(
        "Prepare me a financial analysis using this data (in millions of dollars): " +
          JSON.stringify({ ...bs, ...bsc, ...dcf, ...kme, ...kra })
      );
      var newsPrompt = "Prepare me a summary of the articles";
      for (var i = 0; i < newsResponse.length; i++) {
        newsPrompt += " " + newsResponse[i]["url"];
      }
      const newsSummary = await getResponse(newsPrompt);
      return {
        report: fsReport + "\n" + newsSummary,
      };
    });
    return report;
  } catch (error) {
    console.error(error);
  }
}

async function getNews(symbol) {
  return await getDataFromFMP("stock_news", `tickers=${symbol}&limit=3`).then(
    (dataFromFMP) => {
      return dataFromFMP;
    }
  );
}

app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await getResponse(message);
    res.json({ response });
    console.log(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.post("/api/fsdata/metric", async (req, res) => {
  const { symbol } = req.body;
  try {
    getMetrics(symbol).then((response) => {
      res.json({ response });
      console.log(response);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.post("/api/fsdata/news", async (req, res) => {
  const { symbol } = req.body;
  try {
    getNews(symbol).then((response) => {
      res.json({ response });
      console.log(response);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.post("/api/fsdata/report", async (req, res) => {
  const { symbol } = req.body;
  try {
    getReport(symbol).then((response) => {
      res.json({ response });
      console.log(response);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
