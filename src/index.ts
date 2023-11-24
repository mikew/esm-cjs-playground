import { add, multiply } from './math'

export default function generateConfig() {
  return {
    a: add(12, 5),
    b: multiply(12, 5),
  }
}
