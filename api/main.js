import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import {
  initializeDatabase,
  createMemoryTable,
  createUserTable,
  insertDefaultUser,
} from './db.js'
import { validateMemory } from './middlewares.js'
import {
  handleGetMemories,
  handlePostMemory,
  handleGetMemoryById,
  handleUpdateMemory,
  handleDeleteMemory,
  handleGetCurrentUser,
  handleUpdateUser,
} from './controllers.js'

const app = express()
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(limiter)

const db = initializeDatabase('memories.db')

createMemoryTable(db)
createUserTable(db)
insertDefaultUser(db)

app.get('/memories', handleGetMemories(db))
app.post('/memories', validateMemory, handlePostMemory(db))
app.get('/memories/:id', handleGetMemoryById(db))
app.put('/memories/:id', handleUpdateMemory(db))
app.delete('/memories/:id', handleDeleteMemory(db))
app.get('/users/current', handleGetCurrentUser(db))
app.put('/users/current', handleUpdateUser(db))

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
