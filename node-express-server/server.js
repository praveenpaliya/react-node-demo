var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

function getData(cache_key) {

	var cache_data = getCacheData( cache_key );
	
	return cache_data;
}

function getCacheData(cache_key) {
	var c_data = myCache.get( 'cache_'+ cache_key );

	if (c_data == undefined) {
		var cache_data = {"plan": [{ id: '1', title:'Premium Plan 1', price:'$20' }, { id: '2', title:'Premium Plan 2', price:'$22' }]};

		myCache.set( "cache_"+ cache_key, cache_data, 10000 );

		return cache_data;
	}

	return c_data;
}


// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);
// Root resolver
var root = {
    message: () => 'Hello World!'
};

// Create an express server and a GraphQL endpoint
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));*/

app.get('/getplan', function (req, res) {
	res.send (getData('plan'));
   	//res.send( {"plan": [{ id: '1', title:'Premium Plan 1', price:'$20' }, { id: '2', title:'Premium Plan 2', price:'$22' }]} );
});

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));