// @flow
import {compose, trim} from 'ramda'
import rankIdentifiers from './rankIdentifiers'
import Rank from './Rank'

export default (s: string): Rank =>
  compose(
    Rank.of,
    parseInt,
    (x: string): string => rankIdentifiers[x] || x,
    trim
  )(s)
