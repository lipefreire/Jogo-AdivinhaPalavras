// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from './data/words';

// Componentes
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/Game/Game';
import GameOver from './components/GameOver/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState("")

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // Pick a random Category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]


    // Pcik a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]


    return {word, category}
  }, [words])
  
  // Starts the secret word Game
  const startGame = useCallback(() => {
    // Limpa todas as letras
    clearLetterStates();

    // Pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((letra) => letra.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  // Process The Letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // checar se a letra já foi enviada de alguma maneira
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    // Utiliza a letra ou leva ela para uma letra errada
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    }
    else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0 ){
      // Resetar todas as states para reiniciar o jogo
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses]);

  // Checa as vitórias
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // Win condition
    if(guessedLetters.length === uniqueLetters.length) {
      // Adicionar pontuação
      setScore((actualScore) => actualScore +=100)
      setGuesses((actualGuesses) => actualGuesses = 3)
      startGame();
    }
  }, [guessedLetters])
  
  // Restart the Game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}

      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}

      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
