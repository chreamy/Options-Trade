import React, { useState, useEffect } from "react";
import mt from "../assets/mountain.jpg";
import ReactCardFlip from "react-card-flip";

function Card({ label, val, description }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front of the Card */}
      <div
        className="hover:scale-[1.03] cursor-pointer bg-[#171f2a] border-[#262d3a] border-[4px] p-4 text-white shadow-md rounded-[10px] w-full h-[100px] flex flex-col justify-center"
        onClick={handleClick}
      >
        <p className="font-bold">{label}</p>
        <p>{val}</p>
      </div>

      <div
        className="hover:scale-[1.03] cursor-pointer bg-[#262d3a] border-[#171f2a] border-[4px] p-4 text-white shadow-md rounded-[10px] w-full h-[100px] flex flex-col justify-center"
        onClick={handleClick}
      >
        <p>{description}</p>
      </div>
    </ReactCardFlip>
  );
}

function StockChart({ stockId }) {
  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        width: "100%",
        height: "100%",
        symbol: stockId, // Use stockId as the ticker symbol
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: "tradingview_chart",
      });
    }
  }, [stockId]); // Re-render when stockId changes

  return (
    <div className="w-full h-[400px] bg-gray-900 rounded shadow-md">
      {/* Embed TradingView widget */}
      <div id="tradingview_chart" className="w-full h-full"></div>
    </div>
  );
}

function Home() {
  const stocks = {
    msft: {
      price: 418.16,
      stdev: 0.02091255767432752,
      score: 6,
      asset: 5.31,
      growth: 27.78,
      dividend: 16.26,
      overall: 27.78,
    },
    nvda: {
      price: 138,
      stdev: 0.06645322386448063,
      score: 5.5,
      asset: 3.4,
      growth: 15.13,
      dividend: 2.9,
      overall: 15.13,
    },
    sbux: {
      price: 96.84,
      stdev: 0.04342255885058418,
      score: 5.0,
      asset: -6.02,
      growth: 35.07,
      dividend: 54.73,
      overall: 54.73,
    },
    meta: {
      price: 576.47,
      stdev: 0.050737095444073455,
      score: 3.5,
      asset: 7.24,
      growth: 17.88,
      dividend: 0,
      overall: 17.88,
    },
    nflx: {
      price: 763.89,
      stdev: 0.03104979469590002,
      score: 3.0,
      asset: 5.39,
      growth: 15.63,
      dividend: 0,
      overall: 15.63,
    },
    amzn: {
      price: 188.99,
      stdev: 0.038039619820746044,
      score: 0.5,
      asset: 6.94,
      growth: 0,
      dividend: 0,
      overall: 6.94,
    },
    u: {
      price: 22.11,
      stdev: 0.11141467226311337,
      score: 0,
      asset: 31.49,
      growth: 0,
      dividend: 0,
      overall: 31.48,
    },
  };

  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStockSelect = (stockId) => {
    const selectedStockWithId = {
      ...stocks[stockId],
      stockId: stockId,
    };

    setSelectedStock(selectedStockWithId);
  };

  const filteredStocks = Object.keys(stocks).filter((stockId) =>
    stockId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-[15%] bg-[#1c1d21] text-white p-4">
        <h2 className="text-xl font-bold mb-4">Stock List</h2>

        {/* Search Bar */}
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Search Stock"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Stock List */}
        <ul>
          {filteredStocks.map((stockId) => (
            <li
              key={stockId}
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => handleStockSelect(stockId)}
            >
              {stockId.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="w-[85%] bg-gray-100 h-[100%] mb-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${mt})`,
        }}
      >
        {selectedStock ? (
          <div className="absolute w-[85%] h-full z-1 shadow-md rounded">
            <div className="flex w-full h-full">
              <div className="w-1/2 p-4 shadow-md">
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    {selectedStock.stockId.toUpperCase()}&nbsp;&nbsp;
                  </h2>
                  <h2 className="text-2xl text-[#5eccdc] font-bold mb-4">
                    ${selectedStock.price}
                  </h2>
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Fundamentals
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6">
                  <Card
                    label="Standard Deviation:"
                    val={selectedStock.stdev.toFixed(4)}
                    description="A measure of the price volatility."
                  />
                  <Card
                    label="Score:"
                    val={selectedStock.score}
                    description="A rating based on financial metrics."
                  />
                  <Card
                    label="Asset:"
                    val={selectedStock.asset}
                    description="The total assets held by the company."
                  />
                  <Card
                    label="Growth:"
                    val={`${selectedStock.growth}%`}
                    description="The projected growth rate of the stock."
                  />
                  <Card
                    label="Dividend:"
                    val={`${selectedStock.dividend}%`}
                    description="% of earnings distributed to shareholders."
                  />
                  <Card
                    label="Overall:"
                    val={`${selectedStock.overall}%`}
                    description="The overall rating of the stock."
                  />
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4 mt-6"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Technicals
                  </h2>
                </div>
                <div className="h-[300px] mx-6">
                  <StockChart stockId={selectedStock.stockId} />
                </div>
              </div>

              {/* Right Pane (Blank) */}
              <div className="w-1/2 p-4 shadow-md rounded bg-gray-100">
                {/* This is the blank pane */}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white">
            Select a stock from the list to view details.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
