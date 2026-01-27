// Simple Node.js server for production
// Run with: node server.js
// Or use: npm install -g serve && serve -s dist -l 3000

import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')))

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  try {
    const indexHtml = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8')
    res.send(indexHtml)
  } catch (error) {
    res.status(500).send('Error loading index.html')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('All routes will serve index.html for SPA routing')
})
