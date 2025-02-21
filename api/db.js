import sqlite3 from 'sqlite3'

export const initializeDatabase = (dbName) => {
  const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
      console.error('Error opening database:', err)
    } else {
      console.log('Database connected successfully')
    }
  })
  db.run('PRAGMA journal_mode = WAL')
  return db
}

export const createMemoryTable = (db) => {
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
  })
}

export const createUserTable = (db) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `)
  })
}

export const insertDefaultUser = (db) => {
  db.get('SELECT * FROM users LIMIT 1', [], (err, user) => {
    if (!user) {
      db.run('INSERT INTO users (name, description) VALUES (?, ?)', [
        'Agustin Grance',
        "Agustín's journey is fueled by curiosity and a passion for building. From exploring code at an early age to crafting web and mobile experiences, he thrives on learning, problem-solving, and pushing creative boundaries. Embracing challenges and new technologies, he continues to shape his ever-evolving path in the world of development. 🚀",
      ])
    }
  })
}
