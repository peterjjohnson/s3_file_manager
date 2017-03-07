'use strict'

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    stormpath = require('express-stormpath'),
    port = process.env.PORT || 3000

app.use(express.static('public/build'))
app.use(stormpath.init(app, {
    web: {
        produces: ['application/json']
    }
}))

app.get('/credentials', (req, res) => {
    const FileManager = require('./lib/file-manager.js'),
        files = new FileManager(req.query.user)
    files.getCredentials()
        .then(credentials => { res.json(credentials) })
        .catch(err => { res.json(err) })
})

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.on('stormpath.ready', () => {
    server.listen(port, () => {
        console.log('Server listening on port ' + port)
    })
})
