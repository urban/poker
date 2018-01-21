// @flow
import {compose, invertObj, is, trim} from 'ramda'
import fl from 'fantasy-land'

const rankIdentifiers = {T: '10', J: '11', Q: '12', K: '13', A: '14'}
const stringIdentifiers = invertObj(rankIdentifiers)

export const stringToRank = (s: string): Rank =>
  compose(
    Rank.of,
    parseInt,
    (x: string): string => rankIdentifiers[x] || x,
    trim
  )(s)

export const rankToString = (x: Rank): string =>
  compose(
    (x: string): string => stringIdentifiers[x] || x,
    String,
    (x: Rank): number => x.$value
  )(x)

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

  $value: number

  constructor(x: number) {
    this.$value = x

    // $FlowFixMe
    this[fl.equals] = this.equals.bind(this)
    // $FlowFixMe
    this[fl.lte] = this.lte.bind(this)
    // $FlowFixMe
    this[fl.reduce] = this.reduce.bind(this)
  }

  inspect() {
    return `Rank(${this.$value})`
  }

  toArray() {
    return [this]
  }

  equals(that: Rank) {
    return this.$value === that.$value
  }

  lte(that: Rank) {
    return this.$value <= that.$value
  }

  reduce<T>(f: Function, x: T): T {
    return f(x, this.$value)
  }
}
