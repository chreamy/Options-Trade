import React, { useState } from "react";
import mt from "../assets/mountain.jpg";

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
    setSelectedStock(stocks[stockId]);
  };

  const filteredStocks = Object.keys(stocks).filter((stockId) =>
    stockId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-[15%] bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Stock List</h2>

        {/* Search Bar */}
        <input
          type="text"
          className="w-full p-2 mb-4 rounded text-black"
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
        className="w-[85%] bg-gray-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${mt})` }} // Apply background image
      >
        <div className="w-full h-full absolute bg-black bg-opacity-70 z-0"></div>
        {selectedStock ? (
          <div className="bg-white bg-opacity-70 p-4 absolute w-[85%] h-full z-1 shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Stock Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Price:</p>
                <p>{selectedStock.price}</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Standard Deviation:</p>
                <p>{selectedStock.stdev.toFixed(4)}</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Score:</p>
                <p>{selectedStock.score}</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Asset:</p>
                <p>{selectedStock.asset}</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Growth:</p>
                <p>{selectedStock.growth}%</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Dividend:</p>
                <p>{selectedStock.dividend}%</p>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <p className="font-bold">Overall:</p>
                <p>{selectedStock.overall}%</p>
              </div>
            </div>
            <p>Price: $XYZ</p>
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
