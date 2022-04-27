/* React imports */
import React from "react";
import { useState, useEffect, useRef } from "react";
import classnames from "classnames";

/* My imports */
import question from "./img/question.png";
import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

/* The Tile function */
const Tile = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  //-- Click event for the tile element
  const clickHandler = () => {
    !isFlipped && !isDisabled && onClick(index); //-- If the card isn't flipped / disabled, call the onClick passed in the parameters
  };

  //-- Returns a tile element
  return (
    <div
      className={classnames("tile", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={clickHandler}
    >
      <div className="tile-face tile-front-face">
        <img src={question} alt="question" />
      </div>
      <div className="tile-face tile-back-face">
        <img src={card.image} alt="question" />
      </div>
    </div>
  );
};

//-- The array of tiles we will be using for the tiles
const tileArray = [
  {
    name: "Water1", //-- Name of the element (used for comparison later)
    image: require("./img/water1.jpg") //-- Image file location
  },
  {
    name: "Water2",
    image: require("./img/water2.jpg")
  },
  {
    name: "Water3",
    image: require("./img/water3.jpg")
  },
  {
    name: "Water4",
    image: require("./img/water4.jpg")
  },
  {
    name: "Water5",
    image: require("./img/water5.jpg")
  },
  {
    name: "Water6",
    image: require("./img/water6.jpg")
  },
  {
    name: "Water7",
    image: require("./img/water7.jpg")
  },
  {
    name: "Water8",
    image: require("./img/water8.jpg")
  },
  {
    name: "Water9",
    image: require("./img/water9.jpg")
  },
  {
    name: "Water10",
    image: require("./img/water10.jpg")
  },
  {
    name: "Water11",
    image: require("./img/water11.jpg")
  },
  {
    name: "Water12",
    image: require("./img/water12.jpg")
  }
];

/*
 * Fisher Yates Shuffle Algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */

function shuffle(array) {
  const len = array.length; //-- Get the length of the array
  for (let i = len; i > 0; i--) {
    //-- iterate through the array
    const rIdx = Math.floor(Math.random() * i); //-- Get a random index from 1 - i
    const tmp = array[i - 1]; //-- Create a temp var so we can perfom a swap
    array[i - 1] = array[rIdx]; //-- Swap the array elements
    array[rIdx] = tmp; //-- Set the random element to the tmp element
  }

  //-- Return the shuffled array
  return array;
}

//-- End fisher yates shuffle algo

//-- App function
export default function App() {
  //-- Create the tiles and define setTiles to shuffle the array when called
  const [tiles, setTiles] = useState(
    shuffle.bind(null, tileArray.concat(tileArray))
  );
  const [flippedTiles, setflippedTiles] = useState([]); //-- Tiles that have been flipped over
  const [correct, setCorrect] = useState(0); //-- Number of correct moves
  const [incorrect, setIncorrect] = useState(0); //-- Number of incorrect moves
  const [showRestart, setshowRestart] = useState(false); //-- Show the restart button
  const [disableTiles, setDisableTiles] = useState(false); //-- Tiles that are currenly disabled
  const [score, setScore] = useState(0); //-- Players score in the current session
  const [startTime, setStartTime] = useState(null); //-- Time the player clicked the first tile
  const [firstMove, setFirstMove] = useState(true); //-- Tells us if it is the players first move or not
  const [clearedTiles, setClearedTiles] = useState({}); //-- Tiles that have been cleared from the board
  const [scoreboard, setScoreboard] = useState([]); //-- Tells us the users scores and moves after each round
  const timeout = useRef(null); //-- Timeout for flipping the tiles

  //-- Disable the tiles function
  const doDisableTiles = () => {
    //-- Set disable tiles to true so the tiles are disabled
    setDisableTiles(true);
  };
  //-- Enable tiles function
  const doEnableTiles = () => {
    //-- Set disable tiles to false so the tiles are enabled
    setDisableTiles(false);
  };

  //-- Check if the player has finished the game or not
  const checkFinished = () => {
    //-- If the amount of cleared tiles is the same as the tile array length, we can assume the game is completed
    if (Object.keys(clearedTiles).length === tileArray.length) {
      //-- Show the restart button
      setshowRestart(true);
      //-- Calculate the users score
      //-- incorrect * 2 + correct / .5 -> Floor
      const newScore = Math.floor((correct * 2 + incorrect) / 0.5);
      //-- Set the new score
      setScore(newScore);

      setScoreboard(
        scoreboard.concat({
          score: newScore,
          correctMoves: correct,
          incorrectMoves: incorrect
        })
      );
    }
  };

  //-- Checks if a tile is flipped or not using the index of the tile
  const checkFlipped = (index) => {
    //-- Return whether the flipped tiles array contains the current index
    return flippedTiles.includes(index);
  };

  //-- Checks to see if a tile is inactive or not
  const checkInactive = (tile) => {
    //-- Returns whether the cleared tiles array returns a value based on the tile.name
    return Boolean(clearedTiles[tile.name]);
  };

  //-- Evaluates whether both flipped tiles match eachother
  const evaluate = () => {
    //-- Get the two tiles from the flipped tiles array
    const [first, second] = flippedTiles;
    //-- Enable all tiles
    doEnableTiles();
    //-- If the names of the two tiles match, then we have the same tile flipped
    if (tiles[first].name === tiles[second].name) {
      //-- Add the tile to the cleared tiles list
      setClearedTiles((prev) => ({ ...prev, [tiles[first].name]: true }));
      //-- Zero out our flipped tiles since we had a match
      setflippedTiles([]);
      //-- Set the number of correct moves to correct + 1
      setCorrect(correct + 1);
      //-- Return to normal execution
      return;
    } else {
      //-- The move was not correct so we add one to out incorrect moves variable
      setIncorrect(incorrect + 1);
    }
    //-- We want to flip the cards back after a certain duration (here we choose 400)
    timeout.current = setTimeout(() => {
      setflippedTiles([]);
    }, 400);
  };
  //-- Handles when a user clicks on one of the tiles
  const clickEventHandler = (index) => {
    //-- If it is the users first move we want to get the time the move was made
    if (firstMove) {
      //-- Set the firstmove varible to false so we don't re-enter this conditional on the next move
      setFirstMove(false);
      //-- Get the time (in ms) of the move
      setStartTime(performance.now());
    }

    //-- If our flipped tiles length already contains a tile, we want to set the flipped tiles and then disable all tiles
    if (flippedTiles.length === 1) {
      //-- Add the tile to the flipped tiles array
      setflippedTiles((prev) => [...prev, index]);
      //-- Disable all tiles
      doDisableTiles();
    } else {
      //-- Otherwise we want to clear the timeout so out tile doesnt flip back over
      clearTimeout(timeout.current);
      //-- Add the single tile to the flipped tiles array
      setflippedTiles([index]);
    }
  };

  //-- React hooks are here
  useEffect(() => {
    //-- Set the timeout to null
    let timeout = null;
    //-- If the flipped tiles are 2 then we want to evaluate and timeout for 300ms
    if (flippedTiles.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    //-- Then we want to return and clear the timeout
    return () => {
      clearTimeout(timeout);
    };
  }, [flippedTiles]);

  //-- React hook
  useEffect(() => {
    //-- Check to see if all tiles have been cleared and then prompt to restart the game
    checkFinished();
  }, [clearedTiles]);

  //-- Handles the restart functionality of the game
  const restartGame = () => {
    //-- We want to zero out our cleared tiles array
    setClearedTiles([]);
    //-- Also zero out our flipped tiles array
    setflippedTiles([]);
    //-- Disable the prompt to restart the game since we are currently restarting
    setshowRestart(false);
    //-- Set the first move back to true so we can track how long the game takes
    setFirstMove(true);
    //-- Set the correct moves back to zero
    setCorrect(0);
    //-- Set the incorrect moves back to zero
    setIncorrect(0);
    //-- We want to enable all of the tiles again
    setDisableTiles(false);
    //-- Re-shuffle all of our tiles so they are not the same as the last round
    setTiles(shuffle(tileArray.concat(tileArray)));
  };

  //-- Calculates the time the player spent playing
  const calculateGameTime = () => {
    //-- Get the ending time in ms
    let end = performance.now();

    //-- Get the difference between the ending ms and the starting ms
    let diff = end - startTime;
    //-- Divide this difference by 1000 to get seconds
    diff /= 1000;
    //-- In case we have a decimal, we want to round a whole number
    diff = Math.round(diff);

    //-- Return the p element displaying the game time in seconds
    return <p>Time elapsed: {diff} seconds.</p>;
  };

  //-- The elements to be rendered by reacts render function
  return (
    <div className="container-wrapper">
      <div className="row">
        <div className="col-lg padding-15">
          <div className="stats-container">
            <div className="stats-card">
              <h1>Scoreboard</h1>
              {scoreboard.map((item) => {
                return (
                  <p>
                    Score:{item.score}, Correct Moves:{item.correctMoves},
                    Incorrect Moves:
                    {item.incorrectMoves}.
                  </p>
                );
              })}
            </div>
          </div>
          <div className="stats-container">
            <div className="stats-card">
              <h1>Current Game Statistics</h1>
              <p>Score: {score}</p>
              <p>Correct Moves: {correct}</p>
              <p>Incorrect Moves: {incorrect}</p>
              {showRestart ? (
                <button className="button-restart" onClick={restartGame}>
                  Restart
                </button>
              ) : (
                ""
              )}
              {showRestart ? calculateGameTime() : ""}
            </div>
          </div>
        </div>
        <div className="col-lg">
          <div className="game-container">
            {tiles.map((tile, index) => {
              return (
                <Tile
                  key={index}
                  card={tile}
                  index={index}
                  isDisabled={disableTiles}
                  isInactive={checkInactive(tile)}
                  isFlipped={checkFlipped(index)}
                  onClick={clickEventHandler}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
