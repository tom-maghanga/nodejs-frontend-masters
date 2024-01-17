#!/usr/bin/env node

"use strict";

import util from 'util';
import path from 'path';
import fs from 'fs';
import  sqlite3  from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';
import staticAlias from  'node-static-alias';

// var sqlite3 = require("sqlite3");


// ************************************


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'my.db');
const DB_SQL_PATH = join(__dirname, 'mydb.sql');
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = {
	run(...args) {
		return new Promise(function c(resolve,reject){
			myDB.run(...args,function onResult(err){
				if (err) reject(err);
				else resolve(this);
			});
		});
	},
	get: util.promisify(myDB.get.bind(myDB)),
	all: util.promisify(myDB.all.bind(myDB)),
	exec: util.promisify(myDB.exec.bind(myDB)),
};

// var fileServer = new staticAlias.Server(WEB_PATH,{
// 	cache: 100,
// 	serverInfo: "Node Workshop: ex5",
// 	alias: [
// 	],
// });

var httpserv = http.createServer(handleRequest);

main();


// ************************************

function main() {
	httpserv.listen(HTTP_PORT);
	console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}
 function handleRequest(req, res){
	if(req.url == "/hello"){
		res.writeHead(200, {"Content-Type" : "text/plain"});
		res.end("Hello  world");
	}
	else{
		res.writeHead(404);
		res.end();
	}
 }

// *************************
// NOTE: if sqlite3 is not working for you,
//   comment this version out
// *************************
async function getAllRecords() {
	var result = await SQL3.all(
		`
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
	);

	return result;
}

// *************************
// NOTE: uncomment and use this version if
//   sqlite3 is not working for you
// *************************
// async function getAllRecords() {
// 	// fake DB results returned
// 	return [
// 		{ something: 53988400, other: "hello" },
// 		{ something: 342383991, other: "hello" },
// 		{ something: 7367746, other: "world" },
// 	];
// }
