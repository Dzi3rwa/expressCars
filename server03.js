var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")

var hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
}));

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.get("/", function (req, res) {
    res.render('index.hbs');
})
app.get("/handleForm", function (req, res) {
    let ub = req.query.inputCheckbox1
    let b = req.query.inputCheckbox2
    let usz = req.query.inputCheckbox3
    let n = req.query.inputCheckbox4

    let doc = {
        ubezpieczony: ub == "on" ? "TAK" : "NIE",
        benzyna: b == "on" ? "TAK" : "NIE",
        uszkodzony: usz == "on" ? "TAK" : "NIE",
        naped4x4: n == "on" ? "TAK" : "NIE"
    }
    coll1.insert(doc, function (err, newDoc) {
        console.log(`Dodano: ${newDoc._id}, ubezpieczony: ${doc.ubezpieczony}, benzyna: ${doc.benzyna}, uszkodzony: ${doc.uszkodzony}, naped 4x4: ${doc.naped4x4}`)
    });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('index.hbs', docs);
    });
})

app.get("/delete", function (req, res) {
    let id = req.query.hidden
    coll1.remove({ _id: id }, {}, function (err, numRemoved) {
        console.log(`Usunięto dokument o id: ${id}`)
    });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('index.hbs', docs);
    });
})
app.get("/edit", function (req, res) {
    let id = req.query.hidden
    let doc = {
        ubezpieczony: `<select name="select1"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        benzyna: `<select name="select2"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        uszkodzony: `<select name="select3"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        naped4x4: `<select name="select4"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`
    }
    coll1.update({ _id: id }, { $set: doc }, {}, function (err, numUpdated) { });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('index2.hbs', docs);
    });
})
app.get("/update", function (req, res) {
    let id = req.query.hidden
    let ub = req.query.select1
    let b = req.query.select2
    let usz = req.query.select3
    let n = req.query.select4

    if (ub == "NIE") ub = "NIE"
    if (ub == "BRAK DANYCH") ub = "BRAK DANYCH"

    if (b == "NIE") b = "NIE"
    if (b == "BRAK DANYCH") b = "BRAK DANYCH"

    if (usz == "NIE") usz = "NIE"
    if (usz == "BRAK DANYCH") usz = "BRAK DANYCH"

    if (n == "NIE") n = "NIE"
    if (n == "BRAK DANYCH") n = "BRAK DANYCH"

    let doc = {
        ubezpieczony: ub,
        benzyna: b,
        uszkodzony: usz,
        naped4x4: n
    }
    coll1.update({ _id: id }, { $set: doc }, {}, function (err, numUpdated) { });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('index.hbs', docs);
    });
})
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})