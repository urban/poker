// @flow
import {is} from 'ramda'
import fl from 'fantasy-land'

export default class Suit {
  static is(x: any) {
    return is(Suit, x)
  }

  static of(x: string) {
    return new Suit(x)
  }

  $value: string

  constructor(x: string) {
    this.$value = x
    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this)
  }

  inspect() {
    return `Suit(${this.$value})`
  }

  toArray() {
    return [this]
  }

  equals(that: Suit) {
    return this.$value === that.$value
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, this.$value)
  }
}
