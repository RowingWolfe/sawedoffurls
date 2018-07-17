const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Todo:
// - Add mongodb backend
// - Validate URLs

const PORT = 3000;
//Middleware
app.use(express.static('public'));
const urlParser = bodyParser.urlencoded({ extended: false });

//Validation
const pattern = ('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
    //if(!pattern.test(str)) 

//Object for holding slugs til DB is added.
slugs = [
    {
        slug: 0,
        url: 'google.com'
    }
];

//Routes
app.post('/newurl',urlParser, (req, res, next) => {
    if(!req.body) return res.sendStatus(400);
    let originalURL = req.body.url;
    let slug = slugs.length + 1;
    let newURL = `https://shortn.io/${slug}`;
    slugs.push({'slug': slug, 'url': newURL})
    console.log(originalURL);
    res.send({originalURL, newURL});
});

app.get('/:slug', (req, res, next) => {
    //Check slug against DB, redirect to URL from the slug.
    slugUrl = slugs[req.params.slug].url;
    res.send(slugUrl); //Should be a redirect
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
