import React from 'react';

const Hand = ({ title, cards }: any) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>{title}</h3>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {cards.map((card: any, idx: number) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
            {card.hidden ? 'Hidden' : `${card.value}${card.suit}`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hand;
