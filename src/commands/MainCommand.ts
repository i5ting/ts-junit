const fs = require('fs')
const path = require('path')

import { Command, Option } from 'clipanion';

import { BaseCommand } from './BaseCommand'

import { executeWithDefaultStrategy, executeFileWithDefaultStrategy } from '../index'

export class MainCommand extends BaseCommand {
    fileOrDir = Option.String();
    // static paths = [[`install`], [`i`]];
    async execute() {
        // check if dir
        (true === this.isFile()) ? this.runFile() : this.runDir()

        this.context.stdout.write(`Hello ${this.fileOrDir}!\n`);
    }
    isFile() {
        let stat = fs.lstatSync(this.fileOrDir)
        return stat.isFile()
    }
    async runFile() {
        let file = path.join(process.cwd(), this.fileOrDir)
        executeFileWithDefaultStrategy(file)
    }
    async runDir() {
        let dir = path.join(process.cwd(), this.fileOrDir)
        executeWithDefaultStrategy(dir)
    }
}