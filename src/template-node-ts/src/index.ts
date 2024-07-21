import path from 'node:path'
import { size } from 'lodash-es'
const _ = require('lodash-es')

console.log('size', size([1, 3]))
console.log('size', _.size([1, 3, 2]))
console.log('path', path.join(__dirname, 'index.ts'))
// console.log(import.meta.url)
