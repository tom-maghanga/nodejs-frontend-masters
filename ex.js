#! usr/bin/env node
"use strict";
import getStdin from 'get-stdin';
import path from "path";
import { createReadStream, promises as fs } from "fs";
import { Transform } from 'stream';
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
    fileReader(process.stdin);
}
else if(args.file){

    let stream = createReadStream(path.resolve(args.file));
    fileReader(stream);
    
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

function fileReader(inStream){
    var outStream = inStream;
    var upperStream = new Transform({
        transform(chunk, enc, cb){
            this.push(chunk.toString().toUpperCase());
            cb();
        }
    })

    outStream = outStream.pipe(upperStream);
    var targetStream = process.stdout;
    outStream.pipe(targetStream);

    
}


if(process.env.HELLO){
    console.log(process.env.HELLO);
}