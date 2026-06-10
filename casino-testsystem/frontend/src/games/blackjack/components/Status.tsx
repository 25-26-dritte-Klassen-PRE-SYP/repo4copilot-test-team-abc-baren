import React from 'react';

const Status = ({ message, balance }: any) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>{message}</h2>
      <div>Balance: ${balance.toFixed(2)}</div>
    </div>
  );
}

export default Status;
