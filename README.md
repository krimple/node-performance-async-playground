# Playground for Node.js performance

This is just a playground to mess around with various processes and
coding styles. I'm using the awesome stress testing tool Locust (see
http://locust.io) to try several variations of reduce problems against a
random data set array.

To set up:

```bash
npm install -g pm2
npm install

pip install locustio
```

To run:

```bash
# server
pm2 --watch start -i 0 index.js
# load testing
locust --host http://localhost:3001
```

Enjoy.

Ken Rimple

