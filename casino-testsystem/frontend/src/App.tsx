import { FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type Item = {
  id: number
  name: string
}

const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || 'http://localhost:3000'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const headline = useMemo(
    () => (editingId === null ? 'Neuen Eintrag anlegen' : 'Eintrag bearbeiten'),
    [editingId],
  )

  const loadItems = async () => {
    try {
      setError('')
      const response = await fetch(`${API_URL}/items`)

      if (!response.ok) {
        throw new Error(`Fehler beim Laden: ${response.status}`)
      }

      const data: Item[] = await response.json()
      setItems(data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  const resetForm = () => {
    setName('')
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Bitte einen Namen eingeben.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const response = await fetch(
        editingId === null ? `${API_URL}/items` : `${API_URL}/items/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: trimmedName }),
        },
      )

      if (!response.ok) {
        throw new Error(`Speichern fehlgeschlagen: ${response.status}`)
      }

      await loadItems()
      resetForm()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (item: Item) => {
    setEditingId(item.id)
    setName(item.name)
    setError('')
  }

  const handleDelete = async (id: number) => {
    try {
      setSaving(true)
      setError('')

      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Löschen fehlgeschlagen: ${response.status}`)
      }

      if (editingId === id) {
        resetForm()
      }

      await loadItems()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Casino Testsystem</p>
          <h1>Items verwalten</h1>
          <p className="intro">
            React spricht hier direkt mit dem Express-Backend und speichert die
            Eintraege in PostgreSQL.
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span className="stat-value">{items.length}</span>
            <span className="stat-label">Items gesamt</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{editingId === null ? 'Neu' : 'Edit'}</span>
            <span className="stat-label">Formularmodus</span>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-header">
            <h2>{headline}</h2>
            <p>{editingId === null ? 'Ein neues Item anlegen.' : 'Name anpassen und speichern.'}</p>
          </div>

          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Zum Beispiel: Pokerchips"
              autoComplete="off"
            />
          </label>

          {error ? <div className="alert">{error}</div> : null}

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Bitte warten...' : editingId === null ? 'Item speichern' : 'Änderung speichern'}
            </button>
            <button type="button" className="secondary" onClick={resetForm}>
              Zuruecksetzen
            </button>
          </div>
        </form>

        <section className="panel list-panel" aria-live="polite">
          <div className="panel-header">
            <h2>Aktuelle Items</h2>
            <p>{loading ? 'Lade Daten...' : 'Direkt aus der Datenbank gelesen.'}</p>
          </div>

          {loading ? (
            <div className="empty-state">Items werden geladen.</div>
          ) : items.length === 0 ? (
            <div className="empty-state">Noch keine Items vorhanden.</div>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li key={item.id} className="item-row">
                  <div>
                    <span className="item-name">{item.name}</span>
                    <span className="item-meta">ID {item.id}</span>
                  </div>

                  <div className="row-actions">
                    <button type="button" className="secondary" onClick={() => startEdit(item)}>
                      Bearbeiten
                    </button>
                    <button type="button" className="danger" onClick={() => void handleDelete(item.id)}>
                      Löschen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
