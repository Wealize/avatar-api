# Despicable.io - You'll adore them too!

The name is in honor of the previous API we were using, adorable.io. Thank you!

Quick and dirty API for avatars, [based on dicebears work](https://github.com/DiceBear/avatars).

```bash
GET http://myurl/api/v1/human/:width/:height/:seed
```

```bash
GET http://myurl/api/v1/avataaars/:width/:height/:seed
```

If you want an AWS S3 url with the image you can do:

```bash
GET http://myurl/api/v1/avataaars/:width/:height/:seed?show_url=yes
```

You receive:

```json
{
    "url": "https://****.amazonaws.com/mypicture.png"
}
```
