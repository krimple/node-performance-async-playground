(function() {
    'use strict';
    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        let j = 0;
        for (let i = 0; i < 1000000; i++) {j + j + i; }
        setImmediate(() => {
            res.send('HIYA DUDE!');
        });
    });

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });

}());
