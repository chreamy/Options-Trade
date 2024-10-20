import React, { useState, useEffect, useRef } from "react";
import birdImg from "../assets/bot.png";
import bg from "../assets/bg2.png";
import dollar from "../assets/dollar.jpg";

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const boundingDivRef = useRef(null); // Ref to the bounding div
  const [birdPosition, setBirdPosition] = useState(250);
  const [gravity, setGravity] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState([
    {
      x: 500,
      height: Math.random() * 200,
      bot: Math.random() * 200 + 20,
      top: Math.random() * 200 - 20,
    }, // Initialize with random bot value
  ]);
  const [score, setScore] = useState(0);
  const [gameWidth, setGameWidth] = useState(500); // Default width
  const [gameHeight, setGameHeight] = useState(500); // Default height
  const birdSize = 100; // Adjust bird size for image
  const obstacleWidth = 150;
  const gapHeight = 300;

  // Update game dimensions based on the bounding div size
  useEffect(() => {
    if (boundingDivRef.current) {
      setGameWidth(boundingDivRef.current.offsetWidth);
      setGameHeight(boundingDivRef.current.offsetHeight);
    }
  }, []);

  const gameLoop = () => {
    setBirdPosition((pos) => {
      const newPos = pos + gravity;
      if (newPos >= gameHeight - birdSize || newPos <= 0) {
        setIsGameOver(true);
      }
      return newPos;
    });

    setObstacles((obs) => {
      const updatedObstacles = obs.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - 8,
      }));

      if (updatedObstacles[0].x < -obstacleWidth) {
        setScore((prev) => prev + 0.5);
        updatedObstacles.shift();
        updatedObstacles.push({
          x: gameWidth,
          height: Math.random() * 200,
          bot: Math.random() * 200 + 20,
          top: Math.random() * 200 + 20, // Assign a random bot value for each new obstacle
        });
      }

      updatedObstacles.forEach((obstacle) => {
        const inObstacleRange = obstacle.x <= 50 && obstacle.x >= 0;
        const birdTopCollision = birdPosition < obstacle.height;
        const birdBottomCollision =
          birdPosition + birdSize > obstacle.height + gapHeight;

        if (inObstacleRange && (birdTopCollision || birdBottomCollision)) {
          setIsGameOver(true);
        }
      });

      return updatedObstacles;
    });
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 32) {
      if (isGameOver) {
        resetGame();
      } else {
        setGravity(-6);
      }
    }
  };

  useEffect(() => {
    const gravityTimeout = setTimeout(() => {
      setGravity((g) => g + 0.5);
    }, 20);

    return () => clearTimeout(gravityTimeout);
  }, [gravity]);

  useEffect(() => {
    if (!isGameOver) {
      const gameInterval = setInterval(gameLoop, 20);
      return () => clearInterval(gameInterval);
    }
  }, [birdPosition, obstacles, isGameOver]);

  useEffect(() => {
    // Add event listener for space keyup to prevent default scroll
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameOver]);

  const resetGame = () => {
    setBirdPosition(250);
    setGravity(0);
    setObstacles([
      {
        x: gameWidth,
        height: Math.random() * 200,
        bot: Math.random() * 50 + 20,
      },
    ]);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div
      ref={boundingDivRef}
      className="overflow-x-hidden"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover", // Ensure the background covers the entire div
        backgroundPosition: "center", // Center the background image
      }}
    >
      <div
        className="flex"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% opacity
          zIndex: 0, // Ensure it sits on top of the background image
        }}
      />
      <div
        className="absolute flex rounded-[10px] border-2 border-white h-[200px] items-center z-[1] ml-[50%] translate-x-[-250px] text-[30px] font-medium text-white w-[500px] text-center mt-[10vh]"
        style={{
          backgroundImage: `url(${dollar})`,
          backgroundColor: "rgba(0,0,0,0.8)",
          backgroundBlendMode: "darken",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="my-auto w-full text-center">
          <h2>Net Worth: ${score * 100}</h2>
          {isGameOver && (
            <h2>
              You Lost All Your Investments :(
              <br />
              Press Space to restart
            </h2>
          )}
          {!isGameOver && score == 0 && <h2>Press Space to Flap!</h2>}
        </div>
      </div>

      <div>
        {obstacles.map((obstacle, index) => (
          <>
            <div
              key={index}
              className="z-[2]"
              style={{
                position: "absolute",
                left: `${obstacle.x}px`,
                top: 0,
                width: `${obstacleWidth}px`,
                height: `${obstacle.height - obstacle.top}px`,
                backgroundColor: "red",
              }}
            />
            <div
              key={index + "top"}
              className="z-[2]"
              style={{
                position: "absolute",
                left: `${obstacle.x + obstacleWidth / 2 - 5}px`,
                top: 0,
                width: `${10}px`,
                height: `${obstacle.height}px`,
                backgroundColor: "red",
              }}
            />
          </>
        ))}
        {obstacles.map((obstacle, index) => {
          return (
            <>
              <div
                key={index + "bottom"}
                className="z-[2]"
                style={{
                  position: "absolute",
                  left: `${obstacle.x}px`,
                  top: `${obstacle.height + gapHeight + obstacle.bot}px`,
                  width: `${obstacleWidth}px`,
                  height: `${
                    gameHeight - obstacle.height - gapHeight - obstacle.bot
                  }px`,
                  backgroundColor: "green",
                }}
              />
              <div
                key={index + "bottom"}
                className="z-[2]"
                style={{
                  position: "absolute",
                  left: `${obstacle.x + obstacleWidth / 2 - 5}px`,
                  top: `${obstacle.height + gapHeight}px`,
                  width: `${10}px`,
                  height: `${gameHeight - obstacle.height - gapHeight}px`,
                  backgroundColor: "green",
                }}
              />
            </>
          );
        })}
        {/* Bird Image */}
        <img
          src={birdImg} // Path to your bird image
          alt="Bird"
          style={{
            position: "absolute",
            left: "50px",
            top: `${birdPosition}px`,
            width: `${birdSize}px`,
            height: `${birdSize}px`,
          }}
        />
      </div>
    </div>
  );
};

export default FlappyBird;
