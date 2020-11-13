import express from 'express';
import Avatars from '@dicebear/avatars';
import humanSprites from '@dicebear/avatars-human-sprites';
import avataaarSprites from '@dicebear/avatars-avataaars-sprites';

var app = express();

app.get('/api/v1/human/:seed', function(req, res) {
    let options = {};
    let avatars = new Avatars(humanSprites, options);
    let svg = avatars.create(req.params.seed);
    res.send(svg);
});

app.get('/api/v1/avataaars/:seed', function(req, res) {
    let options = {};
    let avatars = new Avatars(avataaarSprites, options);
    let svg = avatars.create(req.params.seed);
    res.send(svg);
});

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
