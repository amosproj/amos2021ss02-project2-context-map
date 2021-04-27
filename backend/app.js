const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

/*const SparqlParser = require('sparqljs').Parser;
const parser = new SparqlParser();
const parsedQuery = parser.parse(
    'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
    'PREFIX dc: <http://purl.org/dc/elements/1.1/>' +
    'PREFIX : <http://dbpedia.org/resource/>' +
    'PREFIX dbpedia2: <http://dbpedia.org/property/>' +
    'PREFIX dbpedia: <http://dbpedia.org/>' +
    'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
    'SELECT ?title WHERE {' +
    '     ?game foaf:name ?title' +
    '} ORDER by ?title');

console.log(JSON.stringify(parsedQuery));*/

const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const driver = neo4j.driver('bolt://34.237.218.15:7687', neo4j.auth.basic('neo4j', 'winch-stub-bases'));
const session = driver.session();

app.get('/', function (req, res) {
    session
        .run('\n' +
            'MATCH network = (dc:DataCenter {name:"DC1",location:"Iceland, Rekjavik"}) -[:CONTAINS]->(:Router) -[:ROUTES]->(:Interface) RETURN network')
        .then(function (result) {
            let dispArr = [];
            result.records.forEach(function (record) {
                //console.log(record);
                dispArr.push({
                    location: record._fields[0].start.properties.location
                });
            });
            res.render('index', {
                identities: dispArr
            })
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;
