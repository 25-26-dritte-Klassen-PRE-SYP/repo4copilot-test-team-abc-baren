import React, { useState, useEffect } from 'react';
import Status from './components/Status';
import Controls from './components/Controls';
import Hand from './components/Hand';
import jsonData from './deck.json';
import profileData from './profile.json';
import styles from './App.module.css';

const GameState = {
  bet: 0,
  init: 1,
  userTurn: 2,
  dealerTurn: 3,
} as const

type GameState = typeof GameState[keyof typeof GameState]

const Deal = {
  user: 0,
  dealer: 1,
  hidden: 2,
} as const

type Deal = typeof Deal[keyof typeof Deal]

const Message = {
  bet: 'Place a Bet!',
  hitStand: 'Hit or Stand?',
  bust: 'Bust!',
  userWin: 'You Win!',
  dealerWin: 'Dealer Wins!',
  tie: 'Tie!',
} as const

type Message = typeof Message[keyof typeof Message]

const App: React.FC = () => {
  const data = JSON.parse(JSON.stringify(jsonData.cards));
  const [deck, setDeck]: any[] = useState(data);

  const [userCards, setUserCards]: any[] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards]: any[] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);

  const STORAGE_KEY = 'blackjackUserBalance';
  const [username] = useState(profileData.username ?? 'Max');
  const [balance, setBalance] = useState(profileData.balance ?? 100);
  const [bet, setBet] = useState(0);

  const [gameState, setGameState] = useState<GameState>(GameState.bet);
  const [message, setMessage] = useState<Message>(Message.bet);
  const [buttonState, setButtonState] = useState({
    hitDisabled: false,
    standDisabled: false,
    resetDisabled: true
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedBalance = window.localStorage.getItem(STORAGE_KEY);
    if (!storedBalance) {
      return;
    }

    const parsedBalance = Number(storedBalance);
    if (!Number.isNaN(parsedBalance)) {
      setBalance(parsedBalance);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(balance));
  }, [balance]);

  useEffect(() => {
    if (gameState === GameState.init) {
      drawCard(Deal.user);
      drawCard(Deal.hidden);
      drawCard(Deal.user);
      drawCard(Deal.dealer);
      setGameState(GameState.userTurn);
      setMessage(Message.hitStand);
    }
  }, [gameState]);

  useEffect(() => {
    calculate(userCards, setUserScore);
    setUserCount(userCount + 1);
  }, [userCards]);

  useEffect(() => {
    calculate(dealerCards, setDealerScore);
    setDealerCount(dealerCount + 1);
  }, [dealerCards]);

  useEffect(() => {
    if (gameState === GameState.userTurn) {
      if (userScore === 21) {
        buttonState.hitDisabled = true;
        setButtonState({ ...buttonState });
      }
      else if (userScore > 21) {
        bust();
      }
    }
  }, [userCount]);

  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      }
      else {
        drawCard(Deal.dealer);
      }
    }
  }, [dealerCount]);

  const resetGame = () => {
    console.clear();
    setDeck(data);

    setUserCards([]);
    setUserScore(0);
    setUserCount(0);

    setDealerCards([]);
    setDealerScore(0);
    setDealerCount(0);

    setBet(0);

    setGameState(GameState.bet);
    setMessage(Message.bet);
    setButtonState({
      hitDisabled: false,
      standDisabled: false,
      resetDisabled: true
    });
  }

  const placeBet = (amount: number) => {
    setBet(amount);
    setBalance(Math.round((balance - amount) * 100) / 100);
    setGameState(GameState.init);
  }

  const drawCard = (dealType: Deal) => {
    if (deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck[randomIndex];
      deck.splice(randomIndex, 1);
      setDeck([...deck]);
      console.log('Remaining Cards:', deck.length);
      switch (card.suit) {
        case 'spades':
          dealCard(dealType, card.value, '♠');
          break;
        case 'diamonds':
          dealCard(dealType, card.value, '♦');
          break;
        case 'clubs':
          dealCard(dealType, card.value, '♣');
          break;
        case 'hearts':
          dealCard(dealType, card.value, '♥');
          break;
        default:
          break;
      }
    }
    else {
      alert('All cards have been drawn');
    }
  }

  const dealCard = (dealType: Deal, value: string, suit: string) => {
    switch (dealType) {
      case Deal.user:
        userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setUserCards([...userCards]);
        break;
      case Deal.dealer:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setDealerCards([...dealerCards]);
        break;
      case Deal.hidden:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
        setDealerCards([...dealerCards]);
        break;
      default:
        break;
    }
  }

  const revealCard = () => {
    dealerCards.filter((card: any) => {
      if (card.hidden === true) {
        card.hidden = false;
      }
      return card;
    });
    setDealerCards([...dealerCards])
  }

  const calculate = (cards: any[], setScore: any) => {
    let total = 0;
    cards.forEach((card: any) => {
      if (card.hidden === false && card.value !== 'A') {
        switch (card.value) {
          case 'K':
            total += 10;
            break;
          case 'Q':
            total += 10;
            break;
          case 'J':
            total += 10;
            break;
          default:
            total += Number(card.value);
            break;
        }
      }
    });
    const aces = cards.filter((card: any) => {
      return card.value === 'A';
    });
    aces.forEach((card: any) => {
      if (card.hidden === false) {
        if ((total + 11) > 21) {
          total += 1;
        }
        else if ((total + 11) === 21) {
          if (aces.length > 1) {
            total += 1;
          }
          else {
            total += 11;
          }
        }
        else {
          total += 11;
        }
      }
    });
    setScore(total);
  }

  const hit = () => {
    drawCard(Deal.user);
  }

  const stand = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setGameState(GameState.dealerTurn);
    revealCard();
  }

  const bust = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setMessage(Message.bust);
  }

  const checkWin = () => {
    if (userScore > dealerScore || dealerScore > 21) {
      setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
      setMessage(Message.userWin);
    }
    else if (dealerScore > userScore) {
      setMessage(Message.dealerWin);
    }
    else {
      setBalance(Math.round((balance + (bet * 1)) * 100) / 100);
      setMessage(Message.tie);
    }
  }

  return (
    <div className={styles.gameScreen}>
      <div className={styles.statusControlsRow}>
        <Status
          message={message}
          balance={balance}
          username={username}
        />
        <Controls
          balance={balance}
          gameState={gameState}
          buttonState={buttonState}
          betEvent={placeBet}
          hitEvent={hit}
          standEvent={stand}
          resetEvent={resetGame}
        />
      </div>
      <div className={styles.tableShell}>
        <div className={styles.tableSurface}>
          <div className={styles.tableTop}>
            <span className={styles.tableLabel}>Blackjack Table</span>
          </div>
          <div className={styles.dealerArea}>
            <span className={styles.areaLabel}>Dealer</span>
            <Hand title={`Dealer (${dealerScore})`} cards={dealerCards} />
          </div>
          <div className={styles.playerArea}>
            <span className={styles.areaLabel}>You</span>
            <Hand title={`Player (${userScore})`} cards={userCards} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
