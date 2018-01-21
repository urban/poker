// @flow
import {
  all,
  compose,
  concat,
  equals,
  is,
  map,
  sort,
  toString,
  zipWith,
} from 'ramda'
import fl from 'fantasy-land'
import Card from './Card'

const cardSort = sort(
  (a: Card, b: ?Card) => (!b || a.equals(b) ? 0 : a.lte(b) ? 1 : -1)
)

export default class Hand {
  static is(x: any) {
    return is(this, x)
  }

  static of(cards: Array<Card>) {
    return new Hand(cards)
  }

  static from(xs: Array<string>) {
    const cards = map(Card.from, xs)
    return compose(Hand.of, cardSort, map(Card.from))(xs)
  }

  cards: Array<Card>

  constructor(cards: Array<Card>) {
    this.cards = cards
    // $FlowFixMe
    this[fl.concat] = this.concat.bind(this)
    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this)
  }

  toString() {
    return `Hand(${map(toString, this.cards).toString()})`
  }

  toArray() {
    return [this]
  }

  concat(that: Hand) {
    return compose(Hand.of, cardSort, concat(this.cards))(that.cards)
  }

  equals(that: Hand) {
    return compose(all(equals(true)), zipWith(equals, this.cards))(that.cards)
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, this.cards)
  }
}
