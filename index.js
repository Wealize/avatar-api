const express = require('express');
const Avatars = require('@dicebear/avatars').default;
const humanSprites = require('@dicebear/avatars-human-sprites').default;
const avataaarSprites = require('@dicebear/avatars-avataaars-sprites').default;
const aws = require('./aws');
const { convert } = require('convert-svg-to-png');

var app = express();

app.get('/api/v1/:avatar_lib/:width/:seed', function(req, res) {
    const options = {};
    let sprites = humanSprites;

    switch(req.params.avatar_lib) {
        case 'human':
            sprites = humanSprites
            break;
        case 'avaaatar':
            sprites = avataaarSprites
            break;
    }

    const avatars = new Avatars(sprites, options);
    const svg = avatars.create(req.params.seed);
    const fileName = `${req.params.seed}.png`;

    res.set('Content-Type', 'image/png');

    aws.getObject(fileName, async (err, data) => {
        if (data) {
            console.log('Existing avatar found');
            return res.end(data.Body);
        }

        const png = await convert(svg, {
            width: parseInt(req.params.width || 500, 10),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        });

            console.log('Generating new avatar');
            aws.uploadFile(fileName, png, () => {
            res.end(png);
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
