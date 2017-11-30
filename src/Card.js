// @flow
import {is} from 'ramda'
import fl from 'fantasy-land'
import Rank from './Rank'
import Suit from './Suit'

export default class Card {
  static is(x: any) {
    return is(this, x)
  }

  static of(rank: Rank, suit: Suit) {
    return new Card(rank, suit)
  }

  static from(s: string) {
    return new Card(Rank.from(s[0]), Suit.of(s[1]))
  }

  rank: Rank
  suit: Suit

  constructor(rank: Rank, suit: Suit) {
    this.rank = rank
    this.suit = suit

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this)
  }

  toString() {
    return `Card(${this.rank.toString()}, ${this.suit.toString()})`
  }

  toArray() {
    return [this]
  }

  get isAce(): boolean {
    return this.rank.value === 14
  }

  equals(that: Card) {
    return this.rank.equals(that.rank) && this.suit.equals(that.suit)
  }

  lte(that: Card) {
    return this.rank.lte(that.rank)
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, {rank: this.rank, suit: this.suit})
  }
}
