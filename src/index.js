// @flow
import {compose, map, prop, split, splitAt} from 'ramda'
import LineByLineReader from 'line-by-line'
import Hand from './Hand'
import HandValue from './HandValue'

export const stringToHands = (s: string): Array<Hand> => {
  const [h1, h2] = compose(splitAt(5), split(' '))(s)
  return map(Hand.from, [h1, h2])
}

export const compareHands = (xs: Array<Hand>): number => {
  const [hand1, hand2] = map(compose(HandValue.of, x => x.cards), xs)
  return hand2.lte(hand1) ? 0 : 1
}

const run = (url: string): Promise<[number, number] | string> =>
  new Promise((resolve, reject) => {
    let scores = [0, 0]

    const lineReader = new LineByLineReader(url)

    // Line Parsing
    lineReader.on('error', err => {
      reject(err)
    })

    lineReader.on('line', (line: string) => {
      const hands = stringToHands(line)
      const winner = compareHands(hands)
      scores[winner] += 1
    })

    lineReader.on('end', () => {
      resolve(scores)
    })
  })

export default run
