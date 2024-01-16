#! usr/bin/env node
"use strict";
import getStdin from 'get-stdin';
import path from "path";
import { promises as fs } from "fs";
// var error = require("error");

// printhelp();
function printhelp(){
    console.log("ex usage : ");
    console.log("ex.js --file{FILENAME}" )
    console.log("  --help           Print this help");
    console.log("--file{FILENAME}   proccess this file");
    console.log("--in -             proccess stdin");

}

import minimist from 'minimist';
var args = minimist(process.argv.slice(2), {
    boolean: ['help', 'in'],
    string : ['file']
});
if(args.help){
    console.log("");
    printhelp();
}else if(args.in || args._.includes('-')){
    getStdin().then(fileReader).catch(argsError);
}
else if(args.file){
    const filePath = path.resolve(args.file);
    fs.readFile(filePath, 'utf-8')
        .then(contents => fileReader(contents))
        .catch(err => {
            console.error("Error reading file:", err);
            argsError(err.toString());
        });
}else{
    argsError("Error !, Please review", true);
}

function argsError(msg, includeFile=false){
    console.log(msg);
    if(includeFile){
        console.log("");
        printhelp();
    }
}

function fileReader(contents){
    contents = contents.toString().toUpperCase();
    process.stdout.write(contents)

    
}

if(process.env.HELLO){
    console.log(process.env.HELLO);
}