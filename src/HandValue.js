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

export default class HandValue {
  static is(x: any) {
    return is(HandValue, x)
  }

  static of(cards: Array<Card>) {
    return new HandValue(cards)
  }

  $value: number

  constructor(cards: Array<Card>) {
    this.$value = compose(lastIndexOf(true), handTypes)(cards)

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
  }

  inspect() {
    return `HandValue(${this.$value})`
  }

  equals(that: HandValue) {
    return this.$value === that.$value
  }

  lte(that: HandValue) {
    return this.$value <= that.$value
  }

  isHighCard() {
    return this.$value === 0
  }

  isPair() {
    return this.$value === 1
  }

  isTwoPair() {
    return this.$value === 2
  }

  isThreeOfAKind() {
    return this.$value === 3
  }

  isStraight() {
    return this.$value === 4
  }

  isFlush() {
    return this.$value === 5
  }

  isFullHouse() {
    return this.$value === 6
  }

  isFourOfAKind() {
    return this.$value === 7
  }

  isStraightFlush() {
    return this.$value === 8
  }

  isRoyalFlush() {
    return this.$value === 9
  }
}
