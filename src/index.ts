import chalk from 'chalk'

import fromDirectory from './directory'
import { add, multiply } from './math'

// export { exportTest } from './directory/exportTest'

export default function generateConfig() {
  console.log(chalk.bold('hello world'))

  return {
    a: add(12, 5),
    b: multiply(12, 5),
    foo: fromDirectory(),
  }
}
