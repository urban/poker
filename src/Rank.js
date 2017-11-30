// @flow
import {compose, is, trim} from 'ramda'
import fl from 'fantasy-land'
import type Kicker from './Kicker'
import stringToRank from './stringToRank'

export default class Rank {
  static is(x: any) {
    return is(this, x)
  }

  static of(x: number): Rank {
    return new Rank(x)
  }

  static from(x: string): Rank {
    return stringToRank(x)
  }

  value: number

  constructor(x: number) {
    this.value = x

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this) }

  // showable
  toString() {
    return `${this.constructor.name}(${this.value})`
  }

  toArray() {
    return [this]
  }

  equals(that: Rank | Kicker) {
    return this.value === that.value
  }

  lte(that: Rank | Kicker) {
    return this.value <= that.value
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, this.value)
  }
}
