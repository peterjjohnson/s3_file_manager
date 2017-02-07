'use strict';

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => {
    console.log('Server listening on port ' + port);
})
