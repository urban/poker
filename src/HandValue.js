// @flow
import {
  all,
  allPass,
  ap,
  apply,
  compose,
  equals,
  groupBy,
  head,
  is,
  lastIndexOf,
  length,
  map,
  path,
  pathEq,
  prop,
  sort,
  tail,
  tap,
  toPairs,
  toString,
  values,
  zipWith,
} from 'ramda'
import fl from 'fantasy-land'
import Rank from './Rank'
import Card from './Card'

const cardRank = path(['rank', 'value'])
const cardSuit = path(['suit', 'value'])
const groupByRank = groupBy(compose(toString, cardRank))
const groupBySuit = groupBy(compose(toString, cardSuit))
const descending = (a, b) => (a == b ? 0 : a > b ? -1 : 1)
const groupSize = compose(sort(descending), values, map(length))
const allTrue = all(equals(true))

export const numberInSameRank = compose(groupSize, groupByRank)
export const numberInSameSuit = compose(groupSize, groupBySuit)
export const isSequential = (cards: Array<Card>) => {
  const xs = compose(sort(descending), map(cardRank))(cards)
  const isHighStraight = equals([14, 13, 12, 11, 10])
  if (isHighStraight(xs)) return true

  const isLowStraight = equals([14, 5, 4, 3, 2])
  if (isLowStraight(xs)) return true

  const highCardValue: number = xs[0]
  const comparitor = [...Array(xs.length).keys()].map(x => highCardValue - x)
  const isSequential = compose(allTrue, zipWith(equals, comparitor))(xs)

  return isSequential
}
const isHighStraight = compose(
  equals([14, 13, 12, 11, 10]),
  sort(descending),
  map(cardRank)
)

const highCard = compose(equals([1, 1, 1, 1, 1]), numberInSameRank)
const onePair = compose(equals([2, 1, 1, 1]), numberInSameRank)
const twoPair = compose(equals([2, 2, 1]), numberInSameRank)
const threeOfAKind = compose(equals([3, 1, 1]), numberInSameRank)
const straight = isSequential
const flush = compose(equals(5), apply(Math.max), numberInSameSuit)
const fullHouse = compose(equals([3, 2]), numberInSameRank)
const fourOfAKind = compose(equals([4, 1]), numberInSameRank)
const straightFlush = (xs: Array<Card>) => allPass([straight, flush])(xs)
const royalFlush = (xs: Array<Card>) => allPass([flush, isHighStraight])(xs)

const handTypes = (xs: Array<Card>) =>
  ap(
    [
      highCard,
      onePair,
      twoPair,
      threeOfAKind,
      straight,
      flush,
      fullHouse,
      fourOfAKind,
      straightFlush,
      royalFlush,
    ],
    [xs]
  )

// type Tuple3 = [Array<Rank | Kicker>, Array<Suit>, Array<Card>]

// const handTypes = (value: Tuple3): Array<boolean> =>
//   ap([([ranks]) => equals([false, false, false, false, false], ranks)])

export default class HandValue {
  static is(x: any) {
    return is(HandValue, x)
  }

  static of(cards: Array<Card>) {
    return new HandValue(cards)
  }

  value: [{[string]: Array<Card>}, {[string]: Array<Card>}, Array<Card>]
  numericHandValue: number

  constructor(cards: Array<Card>) {
    this.numericHandValue = compose(lastIndexOf(true), handTypes)(cards)

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
  }

  toString() {
    return `HandValue(${this.numericHandValue})`
  }

  equals(that: HandValue) {
    return this.numericHandValue === that.numericHandValue
  }

  lte(that: HandValue) {
    return this.numericHandValue <= that.numericHandValue
  }

  isHighCard() {
    return this.numericHandValue === 0
  }

  isPair() {
    return this.numericHandValue === 1
  }

  isTwoPair() {
    return this.numericHandValue === 2
  }

  isThreeOfAKind() {
    return this.numericHandValue === 3
  }

  isStraight() {
    return this.numericHandValue === 4
  }

  isFlush() {
    return this.numericHandValue === 5
  }

  isFullHouse() {
    return this.numericHandValue === 6
  }

  isFourOfAKind() {
    return this.numericHandValue === 7
  }

  isStraightFlush() {
    return this.numericHandValue === 8
  }

  isRoyalFlush() {
    return this.numericHandValue === 9
  }
}
