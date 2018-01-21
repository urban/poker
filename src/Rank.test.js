// @flow
import {add, all, compose, equals, identity, map, zipWith} from 'ramda'
import Rank, {stringToRank} from './Rank'
import fl from 'fantasy-land'
import setoid from 'fantasy-land/laws/setoid'
import ord from 'fantasy-land/laws/ord'

const compose3 = f => g => x => f(g(x))

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

test('of method', () => {
  const a = Rank.of(2)
  const b = new Rank(2)
  expect(equals(a, b)).toBe(true)
})

test('is method', () => {
  const a = Rank.of(2)
  expect(Rank.is(a)).toBe(true)
})

test('from method', () => {
  const a = Rank.of(10)
  const b = Rank.from('T')
  expect(equals(a, b)).toBe(true)
})

test('Rank.inspect :: Rank a ~> () -> String', () => {
  const a = Rank.of(10).inspect()
  const b = 'Rank(10)'

  expect(equals(a, b)).toBe(true)
})

test('Rank.equals :: Setoid a => Rank a ~> Rank a -> Boolean', () => {
  // Setoid laws
  const reflexivity = setoid.reflexivity(Rank.of)(equals)(2)
  const symmetry = setoid.symmetry(Rank.of)(equals)(2)
  const transitivity = setoid.transitivity(Rank.of)(equals)(2)

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Rank.lte :: Ord a => Rank a ~> Rank a -> Boolean', () => {
  // Ord laws
  const f = Rank.of(2)
  const g = Rank.of(2)
  const h = Rank.of(2)
  const totality = ord.totality(equals)(f)(g)
  const antisymmetry = ord.antisymmetry(equals)(f)(g)
  const transitivity = ord.transitivity(equals)(f)(g)(h)

  expect(totality).toBe(true)
  expect(antisymmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Rank.reduce :: Foldable f => Rank a ~> ((b, a) -> b, b) -> b', () => {
  const f = Rank.of(2)
  const g = Rank.of(2)
  const a = f.reduce(identity, Rank.of)
  const b = g.toArray().reduce(identity, Rank.of)
  const associativity = equals(a, b)

  expect(associativity).toBe(true)
})
