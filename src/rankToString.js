// @flow
import {compose, invertObj, trim} from 'ramda'
import rankIdentifiers from './rankIdentifiers'
import Rank from './Rank'

const stringIdentifiers = invertObj(rankIdentifiers)

export default (x: Rank): string =>
  compose(
    (x: string): string => stringIdentifiers[x] || x,
    String,
    (x: Rank): number => x.value
  )(x)
