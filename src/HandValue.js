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

  cards: Array<Card>
  value: number

  constructor(cards: Array<Card>) {
    // should
    this.cards = cards
    // Should determin value based on hand types by creating a tuple3
    // tuple [Array<Rank | Kicker>, Array<Suit>, Array<Card>]
    // 1. count rank
    //    consecutive rank
    // 2. count suit
    const ranks = (this.value = compose(lastIndexOf(true), handTypes)(cards))
  }

  toString() {
    return `HandValue(${this.value})`
  }

  // equals(that: HandValue) {
  //   return compose(all(equals(true)), zipWith(equals, this.cards))(that.cards)
  // }

  // lte(that: HandValue) {
  //   return this.equals(that) || this.value <= that.value
  // }

  isHighCard() {
    return this.value === 0
  }

  isPair() {
    return this.value === 1
  }

  isTwoPair() {
    return this.value === 2
  }

  isThreeOfAKind() {
    return this.value === 3
  }

  isStraight() {
    return this.value === 4
  }

  isFlush() {
    return this.value === 5
  }

  isFullHouse() {
    return this.value === 6
  }

  isFourOfAKind() {
    return this.value === 7
  }

  isStraightFlush() {
    return this.value === 8
  }

  isRoyalFlush() {
    return this.value === 9
  }
}
