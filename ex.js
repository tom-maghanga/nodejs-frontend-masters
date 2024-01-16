#! usr/bin/env node
"use strict";
import getStdin from 'get-stdin';
import path from "path";
import fs from "fs/promises";;
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
    fs.readFile(path.resolve(args.file),  function(err, contents) {
        
        if (err) {
            argsError(err.toString());
        } else {
             fileReader(contents);
        }
    });
//    fileReader(path.resolve(args.file));
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