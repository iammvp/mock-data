#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const Mock = require('./lib');


program.usage('<schema-file> <output-file-name>');
/**
 * Help.
 */

function help() {
    program.parse(process.argv);
    if (program.args.length < 1) {
        return program.help();
    }
}
help();

try {
    const schemaFile = require(path.resolve(program.args[0]));
    const outputFile = path.resolve(program.args[1]);
    const fileName = path.extname(outputFile) === '.json' ? outputFile : `${outputFile}.json`; // add .json suffix to output file if not have
    const mocker = new Mock(schemaFile, fileName);
    mocker.init();
} catch (error) {
    console.log(chalk.red(`Can not find schema : '${program.args[0]}'`));
}