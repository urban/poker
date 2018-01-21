// @flow
import {is} from 'ramda'
import fl from 'fantasy-land'
import Rank from './Rank'
import Suit from './Suit'

export default class Card {
  static is(x: any) {
    return is(this, x)
  }

  static of([rank, suit]: [Rank, Suit]) {
    return new Card([rank, suit])
  }

  static from(s: string) {
    return new Card([Rank.from(s[0]), Suit.of(s[1])])
  }

  $value: [Rank, Suit]

  get rank(): Rank {
    return this.$value[0]
  }

  get suit(): Suit {
    return this.$value[1]
  }

  constructor([rank, suit]: [Rank, Suit]) {
    this.$value = [rank, suit]

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this)
  }

  inspect() {
    return `Card(${this.$value[0].inspect()}, ${this.$value[1].inspect()})`
  }

  toArray() {
    return [this]
  }

  equals(that: Card) {
    return this.$value[0].equals(that.$value[0])
  }

  lte(that: Card) {
    return this.$value[0].lte(that.$value[0])
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, this.$value)
  }
}
