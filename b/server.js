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
    model: "gpt-4o-mini",
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
        ...calculated["calculated"][symbol.toLowerCase()],
        ...reports[symbol.toLowerCase()],
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
    const report = await getNews(symbol, 10).then(async (newsResponse) => {
      const report = await getResponse(
        "You are an expert in financial advising called Schwab Bot, today a client wants to learn about stock " +
          symbol +
          "'s potential risks and growth." +
          "They want a detailed financial report encompassing three areas: Fundamental Analysis, Technical Analysis, and Sentimental Analysis. I will guide you through the creation of each section, make sure to respond in three sections: fundamental, technical, and sentimental. \n\n" +
          "**Fundamental Analysis.** here is a financial statement of all the key metrics for the company, 'asset' is the asset based valuation based on BVPS, the latest dividend times 25 is the dividend based valuation, and 'growth' is the growth base valuation based on P/E Growth ratio. Compare three valuations and give analysis on overall fair price value of stock. \n" +
          "financial statement: " +
          JSON.stringify({
            ...bs,
            ...bsc,
            ...dcf,
            ...kme,
            ...kra,
            ...calculated["calculated"][symbol.toLowerCase()],
            ...reports[symbol.toLowerCase()],
          }) +
          "\n\n" +
          "**Technical Analysis.** Based on Indicators like mean reversion, macd, RSI. State that the current direction is more toward bullish or bearish and explain why.\n\n" +
          "**Sentimental Analysis.** Based on the the following news, interpret if the company how more risks or opprtunity, what are some key events and whether now is a good time to invest.\n" +
          "new reports: " +
          newsResponse +
          "\n\nNow generate a detailed eloborated professional report with three segments: fundamental, technical, and sentimental. Bold the numbers, try to quantify as much as possible, elaborate on the process of calculation and concreate specific data. Insert blank lines within each section and use better markdown formatting, don't put formulas.\n\nlastly, be extremely technical and conservative about the upsides of a stock."
      );
      return {
        report: report,
      };
    });
    return report;
  } catch (error) {
    console.error(error);
  }
}

async function getNews(symbol, limit = 3) {
  return await getDataFromFMP(
    "stock_news",
    `tickers=${symbol}&limit=${limit}`
  ).then((dataFromFMP) => {
    return dataFromFMP;
  });
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
