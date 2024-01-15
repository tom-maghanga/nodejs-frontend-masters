#! usr/bin/env node
"use strict";

var path = require("path");
var fs = require("fs");

// printhelp();
function printhelp(){
    console.log("ex usage : ");
    console.log("ex.js --file{FILENAME}" )
    console.log("  --help           Print this help");
    console.log("--file{FILENAME}   proccess this file");

}

var args = require('minimist')(process.argv.slice(2), {
    boolean: 'help',
    string : 'file'
});
if(args.help){
    console.log("");
    printhelp();
}else if(args.file){
    // console.log(__dirname);
   fileReader(path.resolve(args.file));
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

function fileReader(filepath){

    var contents = fs.readFileSync(filepath, function onContents(err, contents){
        if(err){
            error(err.toString());
        }else{
            process.stdout.write(contents);
        }
    });
    process.stdout.write(contents);
}