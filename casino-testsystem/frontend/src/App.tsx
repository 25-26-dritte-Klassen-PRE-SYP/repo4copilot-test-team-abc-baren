import { useEffect, useState } from 'react';

type Item = {
  id: number;
  name: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  async function loadItems() {
    try {
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fehler beim Laden der Items:", err);
    }
  }

  async function saveItem() {
    if (!name.trim()) return;

    if (editId === null) {
      await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } else {
      await fetch(`${API_URL}/items/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setEditId(null);
    }

    setName('');
    loadItems();
  }

  async function deleteItem(id: number) {
    await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    loadItems();
  }

  function startEdit(item: Item) {
    setEditId(item.id);
    setName(item.name);
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h1>Items Testsystem</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={saveItem} style={{ padding: '8px 12px' }}>
          {editId === null ? 'Hinzufügen' : 'Speichern'}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{item.name}</span>
            <button onClick={() => startEdit(item)} style={{ marginRight: '5px' }}>Ändern</button>
            <button onClick={() => deleteItem(item.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;