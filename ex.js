#! usr/bin/env node
"use strict";
import getStdin from 'get-stdin';
import path from "path"; 
import { CAF } from 'caf';
import  zlib, { gzip }  from 'zlib';
import { createWriteStream, createReadStream, promises as fs } from "fs";
import { Transform } from 'stream';

// var error = require("error");

// printhelp();
function printhelp(){
    console.log("ex usage : ");
    console.log("ex.js --file{FILENAME}" )
    console.log("  --help           Print this help");
    console.log("--file{FILENAME}   proccess this file");
    console.log("--in -             proccess stdin");
    console.log("--out              process stdout");
    console.log("--compress         gzip the output")
    console.log("--uncompress       uncompress gzip input");

}

import minimist from 'minimist';
var args = minimist(process.argv.slice(2), {
    boolean: ['help', 'in', 'out'],
    string : ['file']
});



function completeStream(stream) {
    return new Promise(function(resolve, reject) {
        stream.on("end", resolve);
        stream.on("error", reject);
    });
}

fileReader = CAF(fileReader);


var output = path.resolve('out.txt');
if(args.help){
    console.log("");
    printhelp();
}else if(args.in || args._.includes('-')){
    let tooLong = CAF.timeout(3, "Took too long");

    fileReader(tooLong, process.stdin);
}
else if(args.file){
    
    let tooLong = CAF.timeout(3, "Took too long");

    let stream = createReadStream(path.resolve(args.file));
    fileReader(tooLong, stream);
    
    
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




function *fileReader(signal, inStream){
  
    var outStream = inStream;
    if(args.uncompress){
        let gUnZipStream = zlib.createGunzip();
        outStream = outStream.pipe(gUnZipStream);
        
    }
    var upperStream = new Transform({
        transform(chunk, enc, cb){
            this.push(chunk.toString().toUpperCase());
            cb();
        }
    })

    outStream = outStream.pipe(upperStream);

    if(args.compress){
        let gZipStream  = zlib.createGzip();
        outStream = outStream.pipe(gZipStream)
        output = `${output}.gz`;
    }
    var targetStream;
    if(args.out){
        targetStream = process.stdout;

    }else{
        targetStream = createWriteStream(output);

    }
    outStream.pipe(targetStream);
    
    yield completeStream(outStream);

    console.log("Complete !");

    signal.pr.catch(function f(){
        outStream.unpipe(targetStream);
        outStream.destroy();
    })

    
}

if(process.env.HELLO){
    console.log(process.env.HELLO);
}