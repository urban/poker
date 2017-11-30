// @flow
import {add, compose, equals, identity} from 'ramda'
import Rank from './Rank'
import fl from 'fantasy-land'
import setoid from 'fantasy-land/laws/setoid'
import ord from 'fantasy-land/laws/ord'

const compose3 = f => g => x => f(g(x))

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
