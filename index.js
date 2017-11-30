const LineByLineReader = require('line-by-line')
const R = require('ramda')

/////////////////////

const cardRank = ([x, _]) =>
  ({ 'T': '10', 'J': '11', 'Q': '12', 'K': '13', 'A': '14' })[x] || x

const log = R.tap(x => console.log(x))

const group = R.compose(
  R.groupBy(R.identity),
  R.map(cardRank)
)

const groupCardsByRank = R.compose(
  R.sort((a, b) => b - a),
  R.values,
  R.map(R.length),
  group
)

const byRank = R.compose(
  R.sort((a, b) => b - a),
  R.map(x => parseInt(x)),
  R.keys,
  group
)

const hasOnePair = R.compose(
  R.any(R.equals(2)),
  groupCardsByRank
)
const hasTwoPair = R.compose(
  R.all(R.equals(2)),
  R.take(2),
  groupCardsByRank
)
const hasThreeOfAKind = R.compose(
  R.equals(3),
  R.head,
  // log,
  groupCardsByRank
)
const hasStraight = R.compose(
  R.both(
    R.compose(R.equals(5), R.length),
    (xs) => R.head(xs) - 4 === R.last(xs)
  ),
  byRank
)
const hasFlush = R.compose(
  R.equals(1),
  R.length,
  R.keys,
  R.groupBy(R.prop(1))
)
const hasFullHouse = R.both(hasOnePair, hasThreeOfAKind)
const hasFourOfAKind = R.compose(
  R.equals(4),
  R.head,
  groupCardsByRank
)
const hasStraightFlush = R.both(hasStraight, hasFlush)
const hasRoyalFlush = R.both(
  hasStraightFlush,
  R.compose(
    R.equals('14'),
    R.head,
    R.sort((a, b) => b - a),
    R.keys,
    group
  )
)

const rankHand = R.compose(
  R.findLastIndex(R.equals(true)),
  R.values,
  // log,
  R.applySpec({
    highCard: R.T,
    hasOnePair,
    hasTwoPair,
    hasThreeOfAKind,
    hasStraight,
    hasFlush,
    hasFullHouse,
    hasFourOfAKind,
    hasStraightFlush,
    hasRoyalFlush
  })
)

const maxValueIndex = R.converge(
  R.indexOf,
  [
    R.compose(R.toString, R.apply(Math.max)),
    R.map(R.unless(R.is(String), R.toString))
  ]
)

const allEqual = R.converge(
  R.all,
  [
    R.compose(R.equals, R.head),
    R.tail
  ]
)

const compareHighCards = (xs) => {
  const reducer = (xs) => {
    // console.log('cards', xs)
    const values = R.map(R.head, xs)
    return allEqual(values)
      ? reducer(R.map(R.tail, xs))
      : maxValueIndex(values)
  }
  return R.compose(
      reducer,
      R.map(
        // sort by frequency
        R.compose(
          R.map(R.prop(0)),
          R.reverse,
          R.sortBy(R.prop(1)),
          R.toPairs,
          R.map(R.length),
          group
        )
      )
    )(xs)
}

const compareHands = (xs) => {
  const hands = R.map(rankHand, xs)
  return allEqual(hands)
    ? compareHighCards(xs)
    : maxValueIndex(hands)
}

/////////////////////

const run = url => new Promise((resolve, reject) => {
  let players = [0, 0]

  const lineReader = new LineByLineReader(url)

  // Line Parsing
  lineReader.on('error', (err) => {
    reject(err)
  })

  lineReader.on('line', (line) => {
    // do some stuff
    const winner = R.compose(
      compareHands,
      R.splitAt(5),
      R.split(' ')
    )(line)

    // tally score
    players[winner] += 1
  })

  lineReader.on('end', () => {
    resolve(players)
  })
})

run('./poker.txt').then(console.log, console.error)
