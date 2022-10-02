#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

import yargs from 'yargs/yargs';

import { hideBin } from 'yargs/helpers'

import { executeWithDefaultStrategy, executeFileWithDefaultStrategy } from '.'

const argv = yargs(hideBin(process.argv)).argv

// console.dir(argv)

run(argv['_'])


function run(rest: any) {
    rest.map(function (i: string) {
        let item = path.resolve(process.cwd(), i)

        try {
            const stat = fs.lstatSync(item)

            let fileOrDirType = stat.isDirectory() ? 'dir' : stat.isFile() ? 'file' : 'other'

            switch (fileOrDirType) {
                case 'dir':
                    console.warn('find dir ' + item)
                    executeWithDefaultStrategy([item])
                    break;
                case 'file':
                    console.warn('find file 2' + item.replace('.ts', ''))

                    executeFileWithDefaultStrategy([item.replace('.ts', '')])
                    break;
                default:
                    console.warn('unknow type')
                    break;
            }
        } catch (error) {
            throw error
        }

    })
}

