const port = process.env.PORT || 8001

if (!process.env.GITHUB_TOKEN) {
  console.error('No github token provided, please set GITHUB_TOKEN env var')
  return
} else {
  console.log(`starting server on port ${port}`)
}

const { request } = require('@octokit/request')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.listen(port)


app.get('/patch/:gistId', (req, res) => {
  const gistId = req.params.gistId
  response = patchGist(gistId, req.body)
  res.send(response ? 200 : 500)
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
    if (response.status === 200) {
      return true
    } else {
        console.error(response.status)
        console.error(response.data)
        return false
    }
  })
  .catch((err) => console.error(err))
}