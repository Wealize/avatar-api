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
    const showUrl = req.query.show_url;

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
    const fileName = `${req.params.avatar_lib}_${req.params.width}_${req.params.seed}.png`;

    aws.getObject(fileName, async (err, data) => {
        if (data) {
            if (showUrl) {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify({'url': `http://${process.env.AWS_STORAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`}));
            } else {
                res.set('Content-Type', 'image/png');
                res.end(data.Body);
            }

            return;
        }

        const png = await convert(svg, {
            width: parseInt(req.params.width || 500, 10),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        });

        aws.uploadFile(fileName, png, (data) => {
            if (showUrl) {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify({'url': data.Location}));
            } else {
                res.set('Content-Type', 'image/png');
                res.end(png);
            }
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
