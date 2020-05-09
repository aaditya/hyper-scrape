const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();

app.get('/:artist/:track', async (req, res) => {
    try {
        const url = `https://distrokid.com/hyperfollow/${req.params.artist}/${req.params.track}`;
        let { data } = await axios.get(url);
        let $ = cheerio.load(data);
        let nodes = [];
        $('a').each(function (i, link) {
            let imagePath = $(link).children('div').children('div').children('img').attr('src');
            let imageLink = $(link).attr('href');
            if (imagePath) {
                let serviceName = imagePath.split('/')[3].split('.')[0];
                nodes.push({
                    service: serviceName,
                    url: imageLink
                })
            }
        });
        if (nodes.length === 0) {
            res.status(404).json({ message: "Invalid Link", data: null });
            return false;
        }
        res.status(200).json({ data: nodes });
    } catch (err) {
        res.status(err.response.status).send(err);
    }
});

app.listen(3000, () => {
    console.log('Working');
})