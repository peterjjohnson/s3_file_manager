'use strict'

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    port = process.env.PORT || 3000

// Set up our client root to public/build
app.use(express.static(`${__dirname}/public/build`))

// Endpoint to reitrieve user-based credentials from AWS
app.get('/credentials', (req, res) => {
    const FileManager = require('./lib/file-manager.js'),
        files = new FileManager(req.query.user)
    files.getCredentials()
        .then(credentials => { res.json(credentials) })
        .catch(err => { res.json(err) })
})

// All routes not specifically defined here are handled by React Router
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
