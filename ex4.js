#!/usr/bin/env node

"use strict";
import util from 'util';
import path from 'path';
import fs from 'fs';
import  sqlite3  from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import minimist from 'minimist';

// var sqlite3 = require("sqlite3");
// require("console.table");


// ************************************

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'my.db');
const DB_SQL_PATH = join(__dirname, 'mydb.sql');

var args = minimist(process.argv.slice(2),{
	string: ["other",],
});

main().catch(console.error);


// ************************************

var SQL3;

async function main() {
	if (!args.other) {
		error("Missing '--other=..'");
		return;
	}

	// define some SQLite3 database helpers
	var myDB = new sqlite3.Database(DB_PATH);
	SQL3 = {
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

	var initSQL = fs.readFileSync(DB_SQL_PATH,"utf-8");
	await SQL3.exec(initSQL);


	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

	// ***********
	var otherID = await insertOrLookup(other);
	if(otherID){
		let result = await insertSomething(otherID, something);
		if(result){
			var records = await getAllRecords();
			if(records && records.length > 0){
				console.table(records);
			}
		}

	}

	error("Oops!");
}

async function insertSomething(otherID, something){
	let result = await SQL3.run(
		`INSERT INTO 
			Something(otherID, data)
		VALUES
				(?, ?)

		`,
		otherID, something
	);
	if(result && result.changes > 0){
		return true;
	}else{
		return false
	}
}

async function insertOrLookup(other){
	let result = await SQL3.get(
		`SELECT
			id
		 FROM
		 	Other
		 WHERE
		 	data = ?
		`,
		other
	);
	if(result && result.id){
		console.log("Success!");

		return result.id;
	}else{
		result  = await SQL3.run(
			`INSERT
			INTO
				Other(data)
				VALUES
				(?)
			
			`,
			other
		);

		if(result && result.id){
			return result.lastID;
		}
	}
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}
