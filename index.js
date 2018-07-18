const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
require('dotenv').config();

//Config
const PORT = 3000;
const siteUrl = 'derpdeedoo.com';

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

//Schemas
const urlSchema = mongoose.Schema({
    url: String
});
let ShortUrl = mongoose.model('ShortUrl', urlSchema);


//Middleware
app.use(express.static('public'));
const urlParser = bodyParser.urlencoded({ extended: false });

//Routes
app.post('/newurl',urlParser, (req, res, next) => {
    if(!req.body) return res.redirect('/');
    let originalURL = req.body.url;
    console.log((originalURL));

    //Validate URL
    if(validUrl.isUri(originalURL)){
        //DB Connection
        let newShortUrl = new ShortUrl({'url': originalURL});
        newShortUrl.save(function (err, newShortUrl) {
            if (err) return console.error(err);
            console.log(`Saved new URL ${newShortUrl}`);
            let urlWithId = `https://${siteUrl}/${newShortUrl["_id"]}`
            res.send({originalURL, urlWithId});
        });
    }else{
        res.redirect('/');
    }

});

app.get('/:slug', (req, res, next) => {
    //Check slug against DB, redirect to URL from the slug.
    ShortUrl.find({_id:req.params.slug}, (err, urls) => {
        if(err){console.log(err)};
        let forward = urls[0].url;
        res.send(`<meta http-equiv="refresh" content="0; url=${forward}/" /> <h1>Redirecting...</h1>`)
    });
    
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
