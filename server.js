const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require('mongodb');
const app = express();

const PORT = 3000;

MongoClient.connect(`mongodb://localhost:27017/quote_app`, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to mongodb database`);

        const db = client.db('quote_app');
        const quotesCollection = db.collection('quotes');

        app.use(express.static('public'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.set('view engine', 'ejs');

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
        });

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { _id: ObjectId(req.body._id) },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                }, {upsert: false})
                .then(result => {
                    res.send({success: true});
                })
                .catch(console.error);
        });

        app.delete('/quotes', (req, res) => {
            quotesCollection.remove(
                { _id: ObjectId(req.body._id) },
            )
            .then(result => {
                res.send({success: true});
            })
            .catch(console.error);
        });

        app.listen(PORT, () => {
            console.log(`Server started listening on port ${PORT}`);
        });

    })
    .catch(console.error);