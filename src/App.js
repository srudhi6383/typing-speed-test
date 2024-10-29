import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const quotes = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it a popular tool for testing typewriters and fonts.",
  "In a quiet village nestled between the mountains, the air is crisp and fresh.",
  "Technology is rapidly evolving, bringing new innovations to every corner of our lives.",
  "Reading books is a gateway to new worlds and ideas.",
  "The ocean waves crash against the shore, a rhythmic dance that has persisted for millions of years.",
];

function App() {
  const [quote, setQuote] = useState("");
  const [typedText, setTypedText] = useState("");
  const [timer, setTimer] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(null);
  const [correctWordCount, setCorrectWordCount] = useState(0);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isRunning && selectedDuration > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning && selectedDuration > 0) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, selectedDuration]);

  useEffect(() => {
    if (timer === 0 && isRunning) {
      setIsRunning(false);
      calculateWPM();
      inputRef.current.setAttribute("disabled", true);
    }
  }, [timer, isRunning]);

  const startTest = () => {
    if (selectedDuration === 0) {
      alert("Please select a timer duration first!");
      return;
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setTypedText("");
    setCorrectWordCount(0);
    setTimer(selectedDuration);
    setIsRunning(true);
    setWpm(null);
    startTimeRef.current = new Date().getTime();
    inputRef.current.removeAttribute("disabled");
    inputRef.current.focus();
  };

  const handleTyping = (e) => {
    const input = e.target.value;
    setTypedText(input);

    if (input === quote) {
      setIsRunning(false);
      calculateWPM();
      inputRef.current.setAttribute("disabled", true);
    } else {
      countCorrectWords(input);
    }
  };

  const countCorrectWords = (input) => {
    const words = input.trim().split(" ");
    const quoteWords = quote.split(" ");
    let correctWords = 0;

    for (let i = 0; i < words.length; i++) {
      if (words[i] === quoteWords[i]) {
        correctWords++;
      } else {
        break;
      }
    }
    setCorrectWordCount(correctWords);
  };

  const calculateWPM = useCallback(() => {
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTimeRef.current) / 1000 / 60; 
    const wordsPerMinute = correctWordCount / timeTaken;
    setWpm(wordsPerMinute.toFixed(2));
  }, [correctWordCount]);
  
  useEffect(() => {
    if (timer === 0 && isRunning) {
      setIsRunning(false);
      calculateWPM();
      inputRef.current.setAttribute("disabled", true);
    }
  }, [timer, isRunning, calculateWPM]);

  return (
    <div className="container">
      <h1>Typing Speed Test</h1>
      <p id="timer-display">Timer: {timer}s</p>

      <div className="timer-options">
        {[15, 30, 60].map((duration) => (
          <button
            key={duration}
            className={`button-74 ${selectedDuration === duration ? "selected" : ""}`}
            onClick={() => setSelectedDuration(duration)}
          >
            {duration} seconds
          </button>
        ))}
      </div>

      <p id="quote">
        {quote ? quote.split("").map((char, index) => {
          const typedChar = typedText[index] || "";
          const className =
            typedChar === char ? "correct" : typedChar ? "incorrect" : "";
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        }) : "Click 'Start Test' to begin"}
      </p>

      <input
        type="text"
        id="input-box"
        placeholder="Start Typing here"
        value={typedText}
        onChange={handleTyping}
        ref={inputRef}
        disabled={!isRunning}
      />

      <button id="start-test" onClick={startTest}>
        Start Test
      </button>

      {wpm && <div id="result-div">{wpm} WPM</div>}
    </div>
  );
}

export default App;
