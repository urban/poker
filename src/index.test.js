// @flow
import {compose, equals, identity, map, split} from 'ramda'
import run, {stringToHands, compareHands} from './index'
import Hand from './Hand'

test('stringToHands :: string -> Array<Hand>', () => {
  const a = 'TH TD TC 3H 3D'
  const b = '2D 3D 4D 5D 6D'

  const c = map(compose(Hand.from, split(' ')), [a, b])
  const d = stringToHands(a + ' ' + b)

  expect(equals(c, d)).toBe(true)
})

test('compareHands :: Array<Hand> -> number', () => {
  const xs = map(Hand.from, [
    ['TH', 'TD', 'TC', '3H', '3D'],
    ['2D', '3D', '4D', '5D', '6D'],
  ])

  const a = compareHands(xs)
  const b = 1

  expect(equals(a, b)).toBe(true)
})
