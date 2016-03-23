#!/usr/bin/env node

var exampleTxt = 'This will concatenate all the js files in the current directory into a bundle.js';
var argv = require('yargs')
    .option('f', {
        alias: 'files',
        demand: true,
        describe: 'file to wrap',
        type: 'string'
    })
    .usage('$0 concat-cli -f string')
    .example('concat-cli -f *.js -o bundle.js', exampleTxt)
    .help('help')
    .argv;


var	fs = require('fs'),
	path = require('path');

var filename = argv.f;
var name = path.basename(filename)
name = name.replace(/-compiled\..+$/, '')

var file = fs.readFileSync(filename)
var wrapped = wrapper(file, name)

fs.writeFileSync(filename, wrapped)

function wrapper(code, name){

	if (/\n;require.register\(/.test(code)) {
		return code;
	}

	return [
		'\n;require.register("'+name+'",function(exports, require, module){',
		code,
		'});'
	].join('\n');
}
