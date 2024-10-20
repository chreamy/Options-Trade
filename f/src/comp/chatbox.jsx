import React, { useRef } from "react";
import "../App.css";
import user from "../assets/user.png";
import me from "../assets/schwab.png";

export const Chatbox = ({ messages }) => {
  const messageListReference = useRef(null);

  const breakText = (text) => {
    const boldRegex = /(?:<b>(.*?)<\/b>)|(?:\*\*(.*?)\*\*)/g;

    const parts = text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line
          .split(boldRegex)
          .map((part, index) =>
            boldRegex.test(part) ? (
              <strong key={index}>{part.replace(/<\/?b>/g, "")}</strong>
            ) : (
              part
            )
          )}
        <br />
      </React.Fragment>
    ));

    return parts;
  };

  return (
    <div
      ref={messageListReference}
      className="mt-5 p-5 h-[100%] bg-none overflow-y-auto rounded-lg shadow-lg"
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex mb-4 max-w-[100%] ${
            message.position === "right"
              ? "flex-row-reverse self-end"
              : "self-start"
          }`}
        >
          {/* Avatar */}
          <img
            src={message.position === "left" ? me : user}
            alt="Avatar"
            className="w-10 h-10 rounded-full m-2"
          />

          {/* Message Bubble */}
          <div
            className={`p-4 rounded-2xl text-sm leading-tight ${
              message.position === "right"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            <h2 className="m-0">{breakText(message.text)}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};
