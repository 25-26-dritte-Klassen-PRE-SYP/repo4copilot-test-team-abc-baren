import React from 'react';

const Controls = ({ balance, gameState, buttonState, betEvent, hitEvent, standEvent, resetEvent }: any) => {
  const placeBet = (amount: number) => {
    if (balance >= amount) {
      betEvent(amount);
    }
    else {
      alert('Insufficient balance');
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      {gameState === 0 && (
        <>
          <button onClick={() => placeBet(1)}>Bet $1</button>
          <button onClick={() => placeBet(5)}>Bet $5</button>
          <button onClick={() => placeBet(10)}>Bet $10</button>
        </>
      )}
      {gameState !== 0 && (
        <>
          <button disabled={buttonState.hitDisabled} onClick={hitEvent}>Hit</button>
          <button disabled={buttonState.standDisabled} onClick={standEvent}>Stand</button>
          <button disabled={buttonState.resetDisabled} onClick={resetEvent}>Reset</button>
        </>
      )}
    </div>
  );
}

export default Controls;
