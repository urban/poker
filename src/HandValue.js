// @flow
import {
  all,
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
import Rank from './Rank'
import Kicker from './Kicker'
import Card from './Card'

const cardRank = path(['rank', 'value'])
const cardSuit = path(['suit', 'value'])
const groupByRank = groupBy(compose(toString, cardRank))
const groupBySuit = groupBy(compose(toString, cardSuit))

const sortByRank = sort(
  (a: Card, b: Card) => (a.equals(b) ? 0 : a.lte(b) ? 1 : -1)
)

const handRank = (xs: Array<Card>) =>
  compose(
    map(x => !Kicker.is(x)),
    sort(<T: Rank | Kicker>(a: T, b: ?T) => {
      if (!b) {
        return 0
      }
      if (!Kicker.is(a) && Kicker.is(b)) {
        return -1
      }
      if (Kicker.is(a) && !Kicker.is(b)) {
        return 1
      }
      return a.equals(b) ? 0 : a.lte(b) ? 1 : -1
    }),
    map(
      ([k, v]: [string, Array<Card>]): Rank | Kicker =>
        v.length > 1 ? Rank.from(k) : Kicker.from(k)
    ),
    toPairs,
    groupByRank
  )(xs)

const numberInSameSuit = compose(
  apply(Math.max),
  values,
  map(length),
  groupBySuit
)

const allTrue = all(equals(true))
const isSequential = (cards: Array<Card>) => {
  const xs = map(x => x.rank, cards)
  const hasAce = xs[0].value === 14
  const ys = hasAce ? tail(xs) : xs
  const highCardValue = ys[0].value
  const comparitor = [...Array(ys.length).keys()].map(x =>
    Kicker.of(highCardValue - x)
  )
  const isSequential = compose(allTrue, zipWith(equals, comparitor))(ys)

  return (
    (hasAce && highCardValue === 5 && isSequential) ||
    (hasAce && highCardValue === 13 && isSequential) ||
    isSequential
  )
}

const highCard = (xs: Array<Card>) =>
  compose(equals([false, false, false, false, false]), handRank)(xs)
const onePair = (xs: Array<Card>) =>
  compose(equals([true, false, false, false]), handRank)(xs)
const twoPair = (xs: Array<Card>) =>
  compose(equals([true, true, false]), handRank)(xs)
const threeOfAKind = (xs: Array<Card>) =>
  compose(equals([true, false, false]), handRank)(xs)
const straight = (xs: Array<Card>) => compose(isSequential, sortByRank)(xs)
const flush = compose(equals(5), numberInSameSuit)
const fullHouse = (xs: Array<Card>) =>
  compose(equals([true, true]), handRank)(xs)
const fourOfAKind = (xs: Array<Card>) =>
  compose(equals([true, false]), handRank)(xs)
const straightFlush = (xs: Array<Card>) => straight(xs) && flush(xs)
const royalFlush = (xs: Array<Card>) => {
  const isStraightFlush = straightFlush(xs)
  const isAce = (x: Card) => x.rank.value === 14
  const [highCard, ...rest] = sortByRank(xs)
  return isStraightFlush && isAce(highCard)
}

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

  value: [{[string]: Array<Card>}, {[string]: Array<Card>}, Array<Card>]
  numericHandValue: number

  constructor(cards: Array<Card>) {
    // should
    const ranks = groupByRank(cards)
    const suits = groupBySuit(cards)
    this.value = [ranks, suits, cards]
    // Should determin numericHandValue based on hand types by creating a tuple3
    // tuple [Array<Rank | Kicker>, Array<Suit>, Array<Card>]
    // 1. count rank
    //    consecutive rank
    // 2. count suit
    this.numericHandValue = compose(lastIndexOf(true), handTypes)(cards)
  }

  toString() {
    return `HandValue(${this.numericHandValue})`
  }

  // equals(that: HandValue) {
  //   return compose(all(equals(true)), zipWith(equals, this.cards))(that.cards)
  // }

  // lte(that: HandValue) {
  //   return this.equals(that) || this.numericHandValue <= that.numericHandValue
  // }

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
