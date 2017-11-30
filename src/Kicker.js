// @flow
import {is} from 'ramda'
import Rank from './Rank'
import stringToRank from './stringToRank'

export default class Kicker extends Rank {
  static of(x: number) {
    return new Kicker(x)
  }

  static from(s: string) {
    return new Kicker(stringToRank(s).value)
  }
}
