import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Snake from './Snake';
import Fruit from './Fruit';

const SpeedSelection = ({ onStart }) => {
  const [speed, setSpeed] = useState(50);

  const handleSpeedChange = (event) => {
    setSpeed(Number(event.target.value));
  };

  const handleStartGame = () => {
    onStart(speed);
  };

  return (
    <Container>
      <p>
        Welcome to Snake Game! Adjust the speed below and click "Start Game" to begin.
      </p>
      <p>
        [50 ms  - lowest]
        ...............
        [30 ms  - fastest]
      </p>
      <SpeedInput
        type="range"
        min="30"
        max="50"
        value={speed}
        onChange={handleSpeedChange}
      />
      <SpeedLabel>Speed: {speed} ms</SpeedLabel>
      <StartButton onClick={handleStartGame}>Start Game</StartButton>

      <LinkContainer1>
        <p> &lt;Developers&gt; </p>
        <a href="https://www.linkedin.com/in/rishabh-singh-rajput-569828203/">Rishabh Singh Rajput</a>
      </LinkContainer1>
      <LinkContainer>
        <a href="https://www.linkedin.com/in/mayank-maroti/">Mayank Maroti</a>
      </LinkContainer>
    </Container>
  );
};

const Game = ({ speed }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [fruits, setFruits] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [normalFruitEaten, setNormalFruitEaten] = useState(0);
  const [showBonusFruit, setShowBonusFruit] = useState(false);
  const timerRef = useRef(null);

  const moveSnake = () => {
    const newSnake = [...snake];
    let newHead = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(newHead);
    if (newHead.x === fruits[0].x && newHead.y === fruits[0].y) {
      if (showBonusFruit) {
        // Increase snake size by 5 if bonus fruit is eaten
        for (let i = 0; i < 5; i++) {
          newSnake.push({ ...newSnake[newSnake.length - 1] });
        }
        setShowBonusFruit(false);
      } else {
        // Increase snake size by 1 for normal fruit
        newSnake.pop(); // Remove the tail
        setNormalFruitEaten((prevCount) => prevCount + 1);
        if (normalFruitEaten === 4) {
          // Show bonus fruit after eating 5 normal fruits
          setShowBonusFruit(true);
          setNormalFruitEaten(0);
        }
      }
      setScore((prevScore) => prevScore + 1);
      generateNewFruit();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  const checkCollision = () => {
    const head = snake[0];
    if (head.x < 0 || head.x >= 72 || head.y < 0 || head.y >= 40) {
      setGameOver(true);
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        setGameOver(true);
      }
    }
  };

  const generateNewFruit = () => {
    const newFruit = {
      x: Math.floor(Math.random() * 68),
      y: Math.floor(Math.random() * 38)
    };
    setFruits([newFruit]);
  };

  useEffect(() => {
    const startTime = Date.now();
    const intervalRef = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTimer(elapsedTime); // Update the timer state
      if (!gameOver) {
        moveSnake();
        checkCollision();
      }
    }, speed);
  
    timerRef.current = intervalRef;
  
    document.addEventListener('keydown', handleKeyDown);
  
    return () => {
      clearInterval(intervalRef);
      clearInterval(timerRef.current);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, gameOver, speed]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFruits([{ x: 5, y: 5 }]);
    setDirection('RIGHT');
    setScore(0);
    setTimer(0);
    setGameOver(false);
    setNormalFruitEaten(0);
    setShowBonusFruit(false);
  };

  return (
    <StyledGameBoard>
      <Snake snake={snake} />
      {fruits.map((fruit, index) => (
        <Fruit key={index} fruit={fruit} bonus={showBonusFruit} />
      ))}
      {!gameOver && <TimeElapsed>Time: {timer}s</TimeElapsed>}
      <ScoreCounter>Score: {score}</ScoreCounter>
      {gameOver && (
        <GameOverOverlay>
          <div>Game Over!</div>
          <div>Speed: {speed} ms</div> {/* Display the speed */}
          <div>Score: {score}</div> {/* Display the score */}
          <RestartButton onClick={handleRestart}>Restart</RestartButton>
        </GameOverOverlay>
      )}
    </StyledGameBoard>
  );
};

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(null);

  const handleStart = (speed) => {
    setGameSpeed(speed);
    setIsGameStarted(true);
  };

  return (
    <AppContainer>
      {isGameStarted ? (
        <Game speed={gameSpeed} />
      ) : (
        <SpeedSelection onStart={handleStart} />
      )}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
`;

const Container = styled.div`
  text-align: center;
  color: white;

`;

const SpeedInput = styled.input`
  width: 200px;
`;

const SpeedLabel = styled.div`
  margin-top: 10px;
`;

const StartButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const StyledGameBoard = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  width: 1442px;
  height: 807px;
  border: 2px solid black;
  background-color: black;
`;

const TimeElapsed = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  color: black;
`;

const ScoreCounter = styled.div`
  position: absolute;
  top: 10px;
  margin-left: 700px;
  font-size: 18px;
  color: white;
`;

const GameOverOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: red;
  text-align: center;
`;

const RestartButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;
const LinkContainer1 = styled.div`
  position: absolute;
  bottom: 50px;
  left: 10px;
  color: red;
  font-size: 16px;
`;

const LinkContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 16px;
`;

export default App;
