#!/usr/bin/env node

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    watch = require('watch'),
    sys = require('sys'),
    exec = require('child_process').exec
;

var argv = require('optimist')
    .usage('Usage: {OPTIONS}')
    .wrap(80)
    .option('input', {
      alias: 'i',
      demand: 'i',
      desc: 'Specify input file to watch/compile.'
    })
    .option('directory', {
      alias: 'd',
      desc: 'Specify input directory to watch.'
    })
    .option('command', {
        alias: 'c',
        demand: 'c',
        desc: 'Specify command'
    })
    .option('help', {
      alias: 'h',
      desc: 'Show this message'
    })
    .check(function(argv) {
      if (argv.help) {
        throw '';
      }
    }).argv;

var input_file = path.resolve(process.cwd(), argv.input);
var output_file = path.resolve(process.cwd(), argv.output);
var watch_directory = argv.directory ? path.resolve(process.cwd(), argv.directory): '';

/*
 * Check to see if we are watching a directory or just
 * a single file
 */
if (watch_directory){
    watch.watchTree(watch_directory, function(f, curr, prev){
        runShellCommand();
    });
} else {
    fs.watchFile(input_file, function(current, previous) {
        runShellCommand();
    });
}

/**
 * runs shell command
 */
function runShellCommand(){
    console.log("Updated: " + output_file);
    exec(argv.command);
}
function puts(errors, stdout, stderr){
    sys.puts(stdout);
}

