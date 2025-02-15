//CSS
import './App.css';
//React
import { useCallback, useEffect, useState } from 'react';
//data
import { wordList } from './data/words.js';
//Components
import StartScreen from "./components/StartScreen.js"
import Game from './components/Game.js';
import GameOver from './components/GameOver.js';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);



  const pickWordAndCategoty = useCallback(() => {
    //pick random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  },[words]);

  //starts secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();

    //pick word and category
    const { word, category } = pickWordAndCategoty();

    //array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    //console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickWordAndCategoty]);

  //letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();
    //check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses])

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    //win condition
    if(guessedLetters.length === uniqueLetters.length){
      //add score
      setScore((actualScore)=> actualScore += 100)
      //restart game with new word
      startGame();
    }
    console.log(uniqueLetters);
  }, [guessedLetters, letters, startGame]);

  //restart game
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
