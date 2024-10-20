import React, { useState, useEffect, useRef } from "react";
import mt from "../assets/mountain.jpg";
import load from "../assets/load.gif";
import ReactCardFlip from "react-card-flip";
import Spline from "@splinetool/react-spline";
import { CSSTransition } from "react-transition-group";
import { Chatbox } from "../comp/chatbox";
import axios from "axios";
import FlappyBird from "../comp/bird";

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

const callWebhook = () => {
  fetch("https://hooks.spline.design/aa-LjQQwAPY", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "dF6cbFQcXX2lfMQnS4x2h30u_1UJkNTvHVSrU9SYH8c",
      Accept: "application/json",
    },
    body: JSON.stringify({}), // Your data payload here
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
function SplineComponent({ setTextInput }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const thoughtQuestionMapping = [
    {
      botThought: "Ask me about the technical analysis of this stock.",
      userQuestion: "What is the technical analysis of this stock?",
    },
    {
      botThought: "Ask me about the latest news related to this stock.",
      userQuestion: "What is the latest news related to this stock?",
    },
    {
      botThought: "Ask me about the fundamental analysis of this company.",
      userQuestion: "Can you provide the fundamental analysis of this company?",
    },
    {
      botThought:
        "Ask me about asset management strategies for your portfolio.",
      userQuestion:
        "What are some good asset management strategies for my portfolio?",
    },
    {
      botThought: "Ask me about how this stock compares to its competitors.",
      userQuestion: "How does this stock compare to its competitors?",
    },
    {
      botThought: "Ask me about the company's recent earnings report.",
      userQuestion: "Can you share the company's recent earnings report?",
    },
    {
      botThought: "Ask me about the best-performing sectors in the market.",
      userQuestion: "What are the best-performing sectors in the market?",
    },
    {
      botThought:
        "Ask me about how this stock is performing against the market.",
      userQuestion: "How is this stock performing against the market?",
    },
    {
      botThought:
        "Ask me about how macroeconomic factors could affect this company.",
      userQuestion: "How could macroeconomic factors affect this company?",
    },
    {
      botThought:
        "Ask me about the dividend yield and payout ratio of this stock.",
      userQuestion:
        "What is the dividend yield and payout ratio of this stock?",
    },
  ];

  const handleSplineClick = () => {
    // Fade out
    setIsVisible(false);

    // Change message after 1 second (duration of fade-out)
    setTimeout(() => {
      const randomIndex = Math.floor(
        Math.random() * thoughtQuestionMapping.length
      );
      setCurrentIndex(randomIndex);
      setIsVisible(true); // Fade in again
    }, 1000); // 1 second delay to allow fade-out
  };

  const handleAskNowClick = () => {
    // Insert the user question corresponding to the current bot thought into the chat input
    setTextInput(thoughtQuestionMapping[currentIndex].userQuestion);
  };

  return (
    <div className="relative w-[510px] h-[280px] flex mr-[20px] ml-auto cursor-pointer">
      {/* Spline Component */}
      <Spline
        scene="https://prod.spline.design/S7D4JRV2ZdplQ04u/scene.splinecode"
        onClick={handleSplineClick}
      />

      {/* Thought Bubble */}
      <CSSTransition
        in={isVisible}
        timeout={1000} // 1 second for fade
        classNames="fade"
        unmountOnExit
      >
        <div className="top-0 left-0">
          <div className="absolute ml-[-55px] mt-[70px] bg-white text-black p-2 rounded-lg shadow-lg w-[13px] h-[15px]"></div>
          <div className="absolute ml-[-30px] mt-[47px] bg-white text-black p-2 rounded-lg shadow-lg w-[20px] h-[30px]"></div>
          <div className="bg-white text-black p-2 rounded-lg text-[12px] leading-[14px] shadow-lg w-[150px] h-[90px]">
            {thoughtQuestionMapping[currentIndex].botThought}
            {/* Add Ask Now button */}
          </div>
          <button
            className="bg-blue-500 text-white rounded mt-2 px-2 py-1"
            onClick={handleAskNowClick}
          >
            Ask Now
          </button>
        </div>
      </CSSTransition>

      {/* CSS for fade effect */}
      <style jsx>{`
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 1s;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 1s;
        }
      `}</style>
    </div>
  );
}

function StockChart({ stockId, indicators }) {
  const [isPopout, setIsPopout] = useState(false);

  const handlePopout = () => {
    setIsPopout(true);
  };

  const closePopout = () => {
    setIsPopout(false);
  };

  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        // TradingView widget options
        width: "100%",
        height: "100%",
        symbol: stockId,
        container_id: isPopout
          ? "tradingview_chart_popout"
          : "tradingview_chart",
        studies: indicators,
      });
    }
  }, [stockId, indicators, isPopout]);

  return (
    <>
      <div className="relative h-[300px]">
        <div className="w-full h-[300px] bg-gray-900 rounded shadow-md">
          <div id="tradingview_chart" className="w-full h-full"></div>
        </div>

        {/* Popout button */}
        <button
          className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded"
          onClick={handlePopout}
        >
          Popout
        </button>
      </div>

      {/* Popout Modal */}
      {isPopout && (
        <div className="fixed inset-0 bg-black py-[12.5vh] bg-opacity-75 flex justify-center items-center z-50">
          <div className="w-[75%] h-[75vh] bg-gray-900 rounded shadow-lg relative">
            {/* Embed TradingView widget for the pop-out */}
            <div
              id="tradingview_chart_popout"
              className="w-full h-[75vh]"
            ></div>

            {/* Close button */}
          </div>
          <button
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded"
            onClick={closePopout}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

function ChatSystem({ textInput, setTextInput }) {
  const [chatMessages, setChatMessages] = useState([
    {
      position: "left",
      title: "Schwab Bot",
      text: "Hello, I am Schwab Bot. How can I assist you?",
    },
  ]);

  const handleSendMessage = () => {
    if (!textInput) return;

    // Add user message
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { position: "right", title: "User", text: textInput },
    ]);

    axios
      .post("http://localhost:3001/api/message", { message: textInput })
      .then((res) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { position: "left", title: "Schwab Bot", text: res.data.response },
        ]);
        setTextInput("");
      });
  };

  return (
    <div className="w-[80%] mx-auto flex-col h-[50vh]">
      <Chatbox messages={chatMessages} />
      <div className="flex w-full h-[50px] rounded-lg border-2">
        <input
          className="w-[70%] px-2 py-1 bg-gray-200 rounded-l-lg outline-none"
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="w-[30%] bg-black text-white rounded-r-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
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
  const [indicators, setIndicators] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleStockSelect = (stockId) => {
    const selectedStockWithId = {
      ...stocks[stockId],
      stockId: stockId,
    };
    setIsClicked(false);
    setSelectedStock(selectedStockWithId);
  };

  const handleIndicatorChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setIndicators((prev) => [...prev, name]); // Add indicator if checked
    } else {
      setIndicators((prev) => prev.filter((indicator) => indicator !== name)); // Remove indicator if unchecked
    }
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
        <div className="h-[80vh] overflow-y-scroll">
          <ul>
            {filteredStocks.map((stockId) => (
              <li
                key={stockId}
                className="cursor-pointer font-medium p-2 hover:bg-gray-700"
                onClick={() => handleStockSelect(stockId)}
              >
                {stockId.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="w-full bg-[#3d81f4] h-[40px] rounded-[15px]"
          onClick={() => setSelectedStock(null)}
        >
          Game
        </button>
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
              <div className="absolute w-[100px] ml-[50%] translate-x-[-50px] h-full content-center place-self-center justify-self-center items-center flex text-center z-[10]">
                <style>
                  {`
@keyframes zoomFade {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`}
                </style>
                <div
                  className={
                    "text-white font-medium w-[83px] mt-[40px] rounded-[10px] mx-auto" +
                    (!isClicked
                      ? " border-white border-2 cursor-pointer hover:scale-[1.05] h-[70px] bg-[#56b7d8]"
                      : " h-[90px]")
                  }
                  style={{
                    backgroundImage: isClicked ? `url(${load})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "80px",
                    animation: isClicked ? "zoomFade 2s infinite" : "none",
                  }}
                  onClick={handleClick}
                >
                  {isClicked && <h2 className="mt-[20%] text-[30px]">▶</h2>}
                  {!isClicked && <h2 className="mt-[25%]">Analyze</h2>}
                </div>
              </div>
              <div className="w-1/2 p-4 shadow-md overflow-y-scroll">
                <div className="flex px-6 items-center">
                  <h2 className="text-[30px] mt-[8px] text-white font-bold mb-4">
                    {selectedStock.stockId.toUpperCase()}&nbsp;&nbsp;
                  </h2>
                  <h2 className="text-[30px] mt-[8px] text-[#5eccdc] font-bold mb-4">
                    ${selectedStock.price}
                  </h2>
                  <img
                    className="ml-auto w-[50px] h-[50px] mb-[4px]"
                    src={`https://financialmodelingprep.com/image-stock/${selectedStock.stockId.toUpperCase()}.png?apikey=90449c63998514b28abd312885a78779`}
                  />
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Fundamentals
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6">
                  <Card
                    label="Current Assets:"
                    val={selectedStock.stdev.toFixed(4)}
                    description="Things that can be turned into cash quick."
                  />
                  <Card
                    label="Current Liabilites:"
                    val={selectedStock.score}
                    description="Money owed due within 1 year."
                  />
                  <Card
                    label="Shareholder Equity:"
                    val={selectedStock.asset}
                    description="A company's net worth."
                  />
                  <Card
                    label="Dividend Yield:"
                    val={`${selectedStock.growth}%`}
                    description="Dividends per share over share price."
                  />
                  <Card
                    label="Earnings Yield:"
                    val={`${selectedStock.dividend}%`}
                    description="Earnings per share over share price."
                  />
                  <Card
                    label="Goodwill:" 
                    val={`${selectedStock.overall}%`}
                    description="intangible asset from business acquisition"
                  />
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4 mt-6"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Technicals
                  </h2>
                </div>
                <div className="flex px-6 mb-4">
                  <label className="text-white mr-4">
                    <input
                      type="checkbox"
                      name="MASimple@tv-basicstudies"
                      onChange={handleIndicatorChange}
                    />
                    &nbsp;Simple Moving Average (SMA)
                  </label>
                  <label className="text-white mr-4">
                    <input
                      type="checkbox"
                      name="RSI@tv-basicstudies"
                      onChange={handleIndicatorChange}
                    />
                    &nbsp;Relative Strength Index (RSI)
                  </label>
                  <label className="text-white">
                    <input
                      type="checkbox"
                      name="MACD@tv-basicstudies"
                      onChange={handleIndicatorChange}
                    />
                    &nbsp;MACD
                  </label>
                </div>

                {/* Display the stock chart with the selected indicators */}
                <div className="h-[300px] mx-6">
                  <StockChart
                    stockId={selectedStock.stockId}
                    indicators={indicators}
                  />
                </div>
              </div>

              {/* Right Pane (Blank) */}
              <div className="w-1/2 p-4 shadow-md rounded bg-black bg-opacity-70">
                <SplineComponent setTextInput={setTextInput} />
                <ChatSystem textInput={textInput} setTextInput={setTextInput} />
              </div>
            </div>
          </div>
        ) : (
          <FlappyBird />
        )}
      </div>
    </div>
  );
}

export default Home;
