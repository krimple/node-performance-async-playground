(function() {
    'use strict';
    var express = require('express');
    var uuid = require('node-uuid');
    var app = express();
    var async = require('async');
    var R = require('ramda');

    let request_num = 0;
    let requests_in_flight = 0;

    let sourceData = new Array(1000000);
    for (let i = 0; i < 1000000; i++) {
        sourceData[i] = Math.random() * 1000;
    }

    app.get('/randomblock', function (req, res) {
        let key = uuid.v1();
        //console.log('worker started', key);
        async.setImmediate(() => {
            blockCpuFor(Math.random() * 10000);
            res.send(200, 'HIYA DUDE!');
            //console.log('worker finished#', key);
        });
    });

    app.get('/nonfunctionalsum', function(req, res) {
        let sum = 0;
        for (let i = 0; i < sourceData.length; i++) {
            sum = sum + sourceData[i];
        }
        res.send(200, sum);
    })

    app.get('/reducenative', function(req, res) {
        let answer = sourceData.reduce((prev, current) => {
            return current + prev;
        }, 0);
        res.send(200, answer);
    });

    app.get('/reduceasync', function (req, res) {
        let key = uuid.v1();
        //console.log('async reduce started', key);
        async.reduce(sourceData, 0, (accum, value, callback) => {
            process.nextTick(() => {
                callback(null, value + accum);
            });
        },
        (err, result) => {
            //console.log('worker finished#', key);
            if (err) {
                res.send(500, 'failed!');
            } else {
                res.send(200, result);
            }
        });
    });

    app.get('/reduceramdablocking', function(req, res) {
        let key = uuid.v1();
        //console.log('ramda straight reduce started', key);
        let result = R.reduce((a, b) => { return a + b}, 0, sourceData);
        //console.log('ramda straight reduce ended', key);
        res.send(200, result);        
    });

    app.get('/reduceramdanonblocking', function(req, res) {
        let key = uuid.v1();
        //console.log('ramda non-blocking(?) reduce started', key);
        setImmediate(() => {
            let result = R.reduce((a, b) => { return a + b}, 0, sourceData);
            res.send(200, result);        
            //console.log('ramda non-blocking(?) reduce ended', key);
        });
    });

    app.listen(3001, () => {
        console.log('Example app listening on port 3001!');
    });

    // see - https://gist.github.com/tkrueger/3500612
    function blockCpuFor(ms) {
        var shouldRun = true;
        var now = new Date().getTime();
        var result = 0;
        while(shouldRun) {
            result += Math.random() * Math.random();
            if (new Date().getTime() > now +ms)
                return;
        }   
    }
}());
