// @flow
import {equals, identity} from 'ramda'
import setoid from 'fantasy-land/laws/setoid'
import Suit from './Suit'

test('Suit.of :: String -> Suit', () => {
  const a = Suit.of('H')
  const b = new Suit('H')
  expect(equals(a, b)).toBe(true)
})

test('Suit.is :: Any -> Boolean', () => {
  const a = Suit.of('H')
  expect(Suit.is(a)).toBe(true)
})

test('Suit.inspect :: Suit a ~> () -> String', () => {
  const a = Suit.of('H')
  const showable = equals(a.inspect(), 'Suit(H)')

  expect(showable).toBe(true)
})

test('Suit.equals :: Setoid a => Suit a ~> Suit a -> Boolean', () => {
  // Setoid laws
  const reflexivity = setoid.reflexivity(Suit.of)(equals)('H')
  const symmetry = setoid.symmetry(Suit.of)(equals)('H')
  const transitivity = setoid.transitivity(Suit.of)(equals)('H')

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Suit.reduce :: Foldable f => Suit a ~> ((b, a) -> b, b) -> b', () => {
  const f = Suit.of('H')
  const g = Suit.of('H')
  const a = f.reduce(identity, Suit.of)
  const b = g.toArray().reduce(identity, Suit.of)
  const associativity = equals(a, b)

  expect(associativity).toBe(true)
})
