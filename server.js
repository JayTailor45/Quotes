const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const path = require('path');
const app = express();

const PORT = 3000;

MongoClient.connect(`mongodb://localhost:27017/quote_app`, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to mongodb database`);

        const db = client.db('quote_app');
        const quotesCollection = db.collection('quotes');

        app.use(bodyParser.urlencoded({ extended: true }));
        app.set('view engine', 'ejs')

        app.get(`/`, (req, res) => {
            const cursor = db.collection(`quotes`).find().toArray()
                .then(result => {
                    res.render('index.ejs', { quotes: result })
                })
                .catch(console.error);
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    return res.redirect('/');
                })
                .catch(error => console.error(error));
        })

        app.listen(PORT, () => {
            console.log(`Server started listening on port ${PORT}`);
        });

    })
    .catch(console.error);