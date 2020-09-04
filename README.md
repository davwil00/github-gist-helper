# GitHub gist helper

An express server to allow updating github gists from a web app without disclosing your secret github token

## Running
Set an environment variable `GITHUB_TOKEN` to the value of your github token

Run `server.js`

## How to use
Send a request of the form:
```json
{
  "filename": "filename of the file in the gist to update",
  "content": "the new content of the gist"
}
```