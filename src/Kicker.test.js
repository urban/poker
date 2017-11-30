// @flow
import {add, compose, equals, identity} from 'ramda'
import setoid from 'fantasy-land/laws/setoid'
import ord from 'fantasy-land/laws/ord'
import Kicker from './Kicker'

test('Kicker.of :: Int -> Kicker Int', () => {
  const a = Kicker.of(2)
  const b = new Kicker(2)
  expect(equals(a, b)).toBe(true)
})

test('Kicker.is :: Any -> Boolean', () => {
  const a = Kicker.of(2)
  expect(Kicker.is(a)).toBe(true)
})

// TODO: Need to handle error cases
test('Kicker.from :: String -> Card', () => {
  const a = Kicker.of(10)
  const b = Kicker.from('T')
  expect(equals(a, b)).toBe(true)
})

test('Kicker.toString :: Kicker a ~> () -> String', () => {
  const a = Kicker.of(2)
  const showable = equals(a.toString(), 'Kicker(2)')

  expect(showable).toBe(true)
})

test('Kicker.equals :: Setoid a => Kicker a ~> Kicker a -> Boolean', () => {
  // Setoid laws
  const reflexivity = setoid.reflexivity(Kicker.of)(equals)(2)
  const symmetry = setoid.symmetry(Kicker.of)(equals)(2)
  const transitivity = setoid.transitivity(Kicker.of)(equals)(2)

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Kicker.lte :: Ord a => Kicker a ~> Kicker a -> Boolean', () => {
  // Ord laws
  const f = Kicker.of(2)
  const g = Kicker.of(2)
  const h = Kicker.of(2)
  const totality = ord.totality(equals)(f)(g)
  const antisymmetry = ord.antisymmetry(equals)(f)(g)
  const transitivity = ord.transitivity(equals)(f)(g)(h)

  expect(totality).toBe(true)
  expect(antisymmetry).toBe(true)
  expect(transitivity).toBe(true)
})
