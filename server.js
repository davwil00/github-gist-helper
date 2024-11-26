const port = process.env.PORT || 8002
const allowedGistIds = ['ae9400cb85f7f1a801e5331955f16382']

if (!process.env.GITHUB_TOKEN) {
  console.error('No github token provided, please set GITHUB_TOKEN env var')
  return
} else {
  console.log(`starting server on port ${port}`)
}

const { request } = require('@octokit/request')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.listen(port)

const corsOptions = {
  origin: ['https://gloomhaven.davwil00.co.uk', 'localhost']
}

app.options('/:gistId', cors(corsOptions))

app.patch('/:gistId', cors(corsOptions), async (req, res) => {
  const gistId = req.params.gistId
  if (!allowedGistIds.includes(gistId)) {
    res.sendStatus(401)
  }
  const data = req.body
  const response = await patchGist(gistId, data)
  res.status(response.status).send(response.body)
})

app.get('/status', (req, res) => {
  res.send('UP')
})

function patchGist(gistId, data) {
  const requestWithAuth = request.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });

  return requestWithAuth(`PATCH /gists/${gistId}`, {
    gist_id: gistId,
    files: {
      [data.filename]: {
        content: data.content
      }
    }
  }).then((response) => {
    if (response.status !== 200) {
        console.error('Non-200 response', response.status)
        console.error('Response body', response.data)
    }

    return response
  })
  .catch((err) => {
    console.error('A bad thing happened', err)
    return {status: err.status, body: err}
  })
}
