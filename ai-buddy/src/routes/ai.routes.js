const express = require('express')
const agent = require('../../agent/agent')
const cookie = require('cookie')

const router = express.Router()

// GET /api/ai-buddy/search?q=...  (uses agent to search and optionally add to cart)
router.get('/search', async (req, res) => {
  const q = req.query.q || ''
  // extract token from cookie or Authorization header
  let token = null
  if (req.cookies && req.cookies.token) token = req.cookies.token
  else if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2) token = parts[1]
  }

  try {
    const agentResponse = await agent.invoke(
      { messages: [{ role: 'user', content: q }] },
      { metadata: { token } }
    )

    const last = agentResponse.messages[agentResponse.messages.length - 1]
    // last.content may include tool call results; try to return it raw
    return res.status(200).json({ ok: true, reply: last.content })
  } catch (err) {
    console.error('AI agent error', err)
    return res.status(500).json({ ok: false, error: err.message || err })
  }
})

module.exports = router
