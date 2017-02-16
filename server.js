'use strict';

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    stormpath = require('express-stormpath'),
    port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(stormpath.init(app, {
    web: {
        produces: ['application/json']
    }
}));

app.get('*', (reg, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.on('stormpath.ready', () => {
    server.listen(port, () => {
        console.log('Server listening on port ' + port);
    });
});
