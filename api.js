const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('memories.db', (err) => {
  if (err) {
    console.error('Error opening database:', err)
  } else {
    console.log('Database connected successfully')
  }
})

db.run('PRAGMA journal_mode = WAL')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      image TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `)

  db.get('SELECT * FROM users LIMIT 1', [], (err, user) => {
    if (!user) {
      db.run('INSERT INTO users (name, description) VALUES (?, ?)', [
        'Agus',
        "Agus's journey has been a tapestry of curiosity and exploration. From a young age, their inquisitive mind led them through diverse interests. Education shaped their multidisciplinary perspective, while personal experiences added depth and resilience to their story. Embracing challenges and cherishing relationships, Agus continues to craft a unique and inspiring life history.",
      ])
    }
  })
})

app.get('/memories', (req, res) => {
  const { page = 1, limit = 5, sort = 'older' } = req.query
  const offset = (Number(page) - 1) * Number(limit)
  const orderBy = sort === 'older' ? 'ASC' : 'DESC'

  db.serialize(() => {
    // Get total count
    db.get('SELECT COUNT(*) as total FROM memories', [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      // Get paginated results
      db.all(
        `SELECT * FROM memories ORDER BY timestamp ${orderBy} LIMIT ? OFFSET ?`,
        [Number(limit), offset],
        (err, memories) => {
          if (err) {
            res.status(500).json({ error: err.message })
            return
          }
          res.json({
            memories,
            total: row.total,
            hasMore: offset + memories.length < row.total,
          })
        }
      )
    })
  })
})

app.post('/memories', (req, res) => {
  const { name, description, timestamp, image } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all required fields: name, description, timestamp',
    })
    return
  }

  db.serialize(() => {
    const stmt = db.prepare(
      'INSERT INTO memories (name, description, timestamp, image) VALUES (?, ?, ?, ?)'
    )

    stmt.run(
      [name, description, timestamp, image || '/cactus.jpg'],
      function (err) {
        if (err) {
          console.error('Database error:', err)
          res.status(500).json({ error: err.message })
          return
        }

        res.status(201).json({
          message: 'Memory created successfully',
          id: this.lastID,
        })
      }
    )

    stmt.finalize()
  })
})

app.get('/memories/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }
    res.json({ memory: row })
  })
})

app.put('/memories/:id', (req, res) => {
  const { id } = req.params
  const { name, description, timestamp, image } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ?, timestamp = ?, image = ? WHERE id = ?'
  )
  stmt.run(name, description, timestamp, image, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory updated successfully' })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})

app.get('/users/current', (req, res) => {
  db.get('SELECT * FROM users LIMIT 1', [], (err, user) => {
    if (err) {
      console.error('Database error:', err)
      res.status(500).json({ error: err.message })
      return
    }
    res.json(user)
  })
})

// Endpoint para actualizar el usuario
app.put('/users/current', (req, res) => {
  const { name, description } = req.body

  db.run(
    'UPDATE users SET name = ?, description = ? WHERE id = 1',
    [name, description],
    function (err) {
      if (err) {
        console.error('Database error:', err)
        res.status(500).json({ error: err.message })
        return
      }
      res.json({ message: 'User updated successfully' })
    }
  )
})

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err)
    } else {
      console.log('Database connection closed')
    }
    process.exit(0)
  })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
