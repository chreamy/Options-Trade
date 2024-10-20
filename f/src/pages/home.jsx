import React, { useState, useEffect, useRef } from "react";
import mt from "../assets/mountain.jpg";
import p1 from "../assets/1.png";
import p2 from "../assets/2.png";
import p3 from "../assets/3.png";
import p4 from "../assets/4.png";
import placeholder from "../assets/placeholder.png";
import load from "../assets/load.gif";
import ReactCardFlip from "react-card-flip";
import Spline from "@splinetool/react-spline";
import { CSSTransition } from "react-transition-group";
import { Chatbox } from "../comp/chatbox";
import axios from "axios";
import FlappyBird from "../comp/bird";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { sp500 } from "./sp500";
import FinancialChart from "../comp/chart";

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

const NewsList = ({ news }) => {
  return (
    <div className="mx-6">
      {news.map((article, index) => (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200"
        >
          <div
            key={index}
            className="news-item p-4 mb-4 hover:scale-[1.03] hover:bg-[#ff1cc0] hover:bg-opacity-20 border rounded shadow-lg bg-[#171f2a] border-4 border-[#262e38] bg-opacity-80"
          >
            <h2 className="text-xl font-medium text-white mb-2">
              {article.title}
            </h2>
            <div className="flex">
              <div className="flex-1">
                <p className="text-gray-300 mb-1">
                  {new Date(article.publishedDate).toLocaleDateString()}
                </p>
                <p className="text-gray-300 text-[12px] mb-2">{article.text}</p>
              </div>

              <div className="flex-shrink-0 w-1/3 ml-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

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

function ChatSystem({
  textInput,
  setTextInput,
  symbol,
  report,
  chatMessages,
  setChatMessages,
}) {
  const handleSendMessage = (report) => {
    if (!textInput) return;
    if (!report) {
      alert("Please Analyze Stock First.");
      return;
    }

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { position: "right", title: "User", text: textInput },
    ]);

    axios
      .post("https://options-trade.onrender.com/api/message", {
        message:
          "You are a financial advisor, this is the question your client asks you, you want to give a short and concise answer without markdown: '" +
          textInput +
          "'. Now asnwer the question based on the raw data below: \n" +
          JSON.stringify(report),
        symbol: symbol,
      })
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
          onClick={() => {
            console.log(report);
            handleSendMessage(report);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function Home() {
  const stocks = sp500;

  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [darkenOverlay, setDarkenOverlay] = useState(false);
  const [markdownReport, setMarkdownReport] = useState("");
  const [report, setReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      position: "left",
      title: "Schwab Bot",
      text: "Hello, I am Schwab Bot. How can I assist you?",
    },
  ]);

  const handleClick = (ticker) => {
    setIsClicked(true);
    axios
      .post(`https://options-trade.onrender.com/api/fsdata/report`, {
        symbol: ticker,
      })
      .then((response) => {
        setMarkdownReport(response.data.response.res);
        setReport(response.data.response);
        setIsClicked(false);
        setIsModalOpen(true);
      });
  };

  const handleStockSelect = (ticker) => {
    setReport(null);
    setChatMessages([
      {
        position: "left",
        title: "Schwab Bot",
        text: "Hello, I am Schwab Bot. How can I assist you?",
      },
    ]);
    axios
      .post(`https://options-trade.onrender.com/api/fsdata/metric`, {
        symbol: ticker,
      })
      .then((response1) => {
        axios
          .post(`https://options-trade.onrender.com/api/fsdata/news`, {
            symbol: ticker,
          })
          .then((response2) => {
            setSelectedStock({
              stockId: ticker,
              ...response1.data.response,
              news: response2.data.response,
            });

            setIsClicked(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching stock details:", error);
      });
  };

  const handleIndicatorChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setIndicators((prev) => [...prev, name]); // Add indicator if checked
    } else {
      setIndicators((prev) => prev.filter((indicator) => indicator !== name)); // Remove indicator if unchecked
    }
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="h-[75vh] mb-6 overflow-y-scroll">
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
          onClick={() => setSelectedStock("game")}
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
        {selectedStock == "game" ? (
          <FlappyBird />
        ) : selectedStock ? (
          <div className="absolute w-[85%] h-full z-1 shadow-md rounded">
            {isModalOpen && (
              <div className="fixed w-full inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={() => setIsModalOpen(false)} // Close modal on background click
                ></div>

                {/* Modal Content */}
                <div className="relative bg-gray-900 rounded-[20px] w-[55vw] h-[85vh] overflow-y-scroll  p-6 rounded-lg shadow-lg  z-10">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-gray-600"
                    onClick={() => setIsModalOpen(false)} // Close modal on button click
                  >
                    X
                  </button>

                  {/* Render markdown */}
                  <div className="markdown-container p-4 bg-gray-900 text-white rounded-md w-full">
                    <ReactMarkdown
                      className="prose prose-invert max-w-none"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-3xl font-bold text-white mb-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-2xl mt-[5px] font-semibold text-gray-300 mb-3"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-xl font-semibold text-gray-400 mb-2"
                            {...props}
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4
                            className="text-lg font-medium text-gray-400 mb-2"
                            {...props}
                          />
                        ),
                        h5: ({ node, ...props }) => (
                          <h5
                            className="text-md font-medium text-gray-400 mb-1"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="text-base text-gray-300 mb-4"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-white"
                            {...props}
                          />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic text-gray-400" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-400 underline hover:text-blue-500"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-4 text-gray-300"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside mb-4 text-gray-300"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="ml-6 mb-2 text-base" {...props} />
                        ),
                        code({ className, children, ...rest }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              PreTag="div"
                              language={match[1]}
                              style={vs2015}
                              {...rest}
                            >
                              {children}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              {...rest}
                              className="bg-gray-700 text-gray-200 px-1 py-0.5 rounded"
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {markdownReport}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            <div className="flex w-full h-full">
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
                  <div className="w-[100px] h-full mt-[5px] ml-[10px] mb-[10px] flex text-center z-[10]">
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
                        "text-white font-medium w-[83px] rounded-[10px] mx-auto" +
                        (!isClicked
                          ? " border-white border-2 cursor-pointer hover:scale-[1.05] h-[70px] bg-[#3b82f6]"
                          : " h-[70px]")
                      }
                      style={{
                        backgroundImage: isClicked ? `url(${load})` : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "70px",
                        animation: isClicked ? "zoomFade 2s infinite" : "none",
                      }}
                      onClick={() => handleClick(selectedStock.stockId)}
                    >
                      {isClicked && (
                        <h2 className="mt-[15%] ml-[-10px] text-[30px]">▶</h2>
                      )}
                      {!isClicked && <h2 className="mt-[25%]">Analyze</h2>}
                    </div>
                  </div>
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Fundamental Analysis
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6">
                  <Card
                    label="Standard Deviation:"
                    val={selectedStock.stdev.toFixed(4)}
                    description="A measure of the price volatility."
                  />

                  <Card
                    label="Current Assets:"
                    val={`$${selectedStock.totalCurrentAssets}M`}
                    description="Things that can be turned into cash quick."
                  />
                  <Card
                    label="Current Liabilites:"
                    val={`$${selectedStock.totalCurrentLiabilities}M`}
                    description="Money owed due within 1 year."
                  />
                  <Card
                    label="BVPS:"
                    val={selectedStock.bvps}
                    description="The total assets held by the company."
                  />
                  <Card
                    label="Growth:"
                    val={`${(
                      (selectedStock.eps[selectedStock.eps.length - 1] || 0) /
                      (selectedStock.eps[selectedStock.eps.length - 2] ||
                        999999)
                    ).toFixed(4)}%`}
                    description="The growth rate of earnings"
                  />
                  <Card
                    label="Dividend:"
                    val={`${(selectedStock.dividend[9] || 0).toFixed(4)}%`}
                    description="% of earnings distributed to shareholders."
                  />
                  <Card
                    label="Shareholder Equity:"
                    val={`$${selectedStock.totalStockholdersEquity}M`}
                    description="A company's net worth."
                  />
                  <Card
                    label="Dividend Yield:"
                    val={`${selectedStock.dividendYield.toFixed(4)}%`}
                    description="Dividends per share over share price."
                  />
                  <Card
                    label="Earnings Yield:"
                    val={`${selectedStock.earningsYield.toFixed(4)}%`}
                    description="Earnings per share over share price."
                  />
                </div>
                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4 mt-6"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Technical Analysis
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

                <FinancialChart
                  dividend={selectedStock.dividend}
                  cfps={selectedStock.cfps}
                  netmargin={selectedStock.netmargin}
                  interestcoverage={selectedStock.interestcoverage}
                  roic={selectedStock.roic}
                  eps={selectedStock.eps}
                />

                <div className="bg-white h-[0.5px] w-auto mx-6 mb-4 mt-6"></div>
                <div className="flex px-6">
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Sentiment Analysis
                  </h2>
                </div>
                <NewsList news={selectedStock.news} />
              </div>

              {/* Right Pane (Blank) */}
              <div className="w-1/2 p-4 shadow-md rounded bg-black bg-opacity-70">
                <SplineComponent setTextInput={setTextInput} />
                <ChatSystem
                  textInput={textInput}
                  setTextInput={setTextInput}
                  symbol={selectedStock.stockId.toUpperCase()}
                  report={report}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex relative h-full"
            style={{
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "cover",
            }}
          >
            {darkenOverlay && (
              <div
                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10"
                onClick={() => setDarkenOverlay(false)} // Remove darken overlay on click
              >
                <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[700px]">
                  <h2 className="text-xl font-bold mb-4 text-black">
                    Tutorial
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700 mb-2">
                        1. Select a stock you want to research
                      </p>
                      <img src={p1} alt="Step 1" className="h-[150px]" />
                    </div>

                    <div>
                      <p className="text-gray-700 mb-2">
                        2. Analyze key metrics for the stock
                      </p>
                      <img src={p2} alt="Step 2" className="h-[150px]" />
                    </div>

                    <div>
                      <p className="text-gray-700 mb-2">
                        3. Chat with our AI financial advisor
                      </p>
                      <img src={p3} alt="Step 3" className="h-[150px]" />
                    </div>

                    <div>
                      <p className="text-gray-700 mb-2">4. Play the game!</p>
                      <img src={p4} alt="Step 4" className="h-[150px]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute w-[500px] mt-[100px]">
              <Spline
                className="cursor-pointer"
                scene="https://prod.spline.design/S7D4JRV2ZdplQ04u/scene.splinecode"
                onClick={() => {}}
              />
            </div>

            <Spline
              scene="https://prod.spline.design/EMzjEcMrMGdp3RrW/scene.splinecode"
              className="absoloute cursor-pointer"
              onMouseDown={(e) => {
                setDarkenOverlay(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
