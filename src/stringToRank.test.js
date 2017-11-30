// @flow
import {all, compose, equals, map, zipWith} from 'ramda'
import Rank from './Rank'
import stringToRank from './stringToRank'

const allEqual = (a: Array<any>, b: Array<any>) =>
  compose(all(equals(true)), zipWith(equals, a))(b)

test('morph face cards to Ranks', () => {
  const a = map(stringToRank, ['T', 'J', 'Q', 'K', 'A'])
  const b = [Rank.of(10), Rank.of(11), Rank.of(12), Rank.of(13), Rank.of(14)]

  expect(allEqual(a, b)).toEqual(true)
})

test('morph string ranks to Ranks', () => {
  const a = map(stringToRank, ['2', '3', '4', '5', '6', '7', '8', '9'])
  const b = [
    Rank.of(2),
    Rank.of(3),
    Rank.of(4),
    Rank.of(5),
    Rank.of(6),
    Rank.of(7),
    Rank.of(8),
    Rank.of(9),
  ]

  expect(allEqual(a, b)).toEqual(true)
})
