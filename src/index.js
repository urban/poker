// @flow
import {compose, map, split, splitAt} from 'ramda'
import LineByLineReader from 'line-by-line'
import Hand from './Hand'
import HandValue from './HandValue'

const run = url =>
  new Promise((resolve, reject) => {
    let scores = [0, 0]

    const lineReader = new LineByLineReader(url)

    // Line Parsing
    lineReader.on('error', err => {
      reject(err)
    })

    lineReader.on('line', (line: string) => {
      const [h1, h2] = compose(splitAt(5), split(' '))(line)
      const [p1, p2] = map(Hand.from, [h1, h2])
      const [hand1, hand2] = map(HandValue.of, [p1.cards, p2.cards])
      console.log(hand1.toString(), hand2.toString())
      console.log('equals', hand1.equals(hand2))
      console.log('lte', hand1.lte(hand2))
      return

      //       // do some stuff
      //       const winner = compareHands(hands)

      //       // tally score
      //       scores[winner] += 1
    })

    lineReader.on('end', () => {
      resolve(scores)
    })
  })

run('./p.txt').then(console.log, console.error)
// run('./poker.txt').then(console.log, console.error)
