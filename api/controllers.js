export const handleGetMemories = (db) => (req, res) => {
  const { page = 1, limit = 5, sort = 'older' } = req.query
  const offset = (Number(page) - 1) * Number(limit)
  const orderBy = sort === 'older' ? 'ASC' : 'DESC'

  db.all(
    `
    SELECT *, (SELECT COUNT(*) FROM memories) as total 
    FROM memories 
    ORDER BY timestamp ${orderBy} 
    LIMIT ? OFFSET ?
  `,
    [Number(limit), offset],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      const total = rows[0]?.total || 0
      res.json({
        memories: rows,
        total,
        hasMore: offset + rows.length < total,
      })
    }
  )
}

export const handlePostMemory = (db) => (req, res) => {
  const { name, description, timestamp, image } = req.body

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
}

export const handleGetMemoryById = (db) => (req, res) => {
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
}

export const handleUpdateMemory = (db) => (req, res) => {
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
}

export const handleDeleteMemory = (db) => (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
}

export const handleGetCurrentUser = (db) => (req, res) => {
  db.get('SELECT * FROM users LIMIT 1', [], (err, user) => {
    if (err) {
      console.error('Database error:', err)
      res.status(500).json({ error: err.message })
      return
    }
    res.json(user)
  })
}

export const handleUpdateUser = (db) => (req, res) => {
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
}
