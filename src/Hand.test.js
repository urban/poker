// @flow
import {equals, identity} from 'ramda'
import fl from 'fantasy-land'
import setoid from 'fantasy-land/laws/setoid'
import functor from 'fantasy-land/laws/functor'
import Hand from './Hand'
import Card from './Card'

test('Hand.of :: Card a => [a] -> Hand', () => {
  const x = Card.from('TH')
  const a = Hand.of([x])
  const b = new Hand([x])
  expect(equals(a, b)).toBe(true)
})

test('Hand.from :: String a => [a] -> Hand', () => {
  const x = Card.from('TH')
  const a = Hand.from(['TH'])
  const b = new Hand([x])
  expect(equals(a, b)).toBe(true)
})

test('Hand.is :: Any -> Boolean', () => {
  const a = Hand.from(['TH'])
  expect(Hand.is(a)).toBe(true)
})

test('Hand.inspect :: Hand a ~> () -> String', () => {
  const a = Hand.from(['TH'])
  const showable = equals(a.inspect(), 'Hand(Card(Rank(10), Suit(H)))')

  expect(showable).toBe(true)
})

test('Hand.concat :: Semigroup a => Hand a ~> Hand a -> Hand a', () => {
  // Semigroup laws
  const f = Hand.from(['TH'])
  const g = Hand.from(['AH'])
  const h = Hand.from(['2H'])

  const a = f[fl.concat](g)[fl.concat](h)
  const b = f[fl.concat](g[fl.concat](h))
  const associativity = equals(a, b)

  expect(associativity).toBe(true)
})

test('Hand.equals :: Setoid a => Hand a ~> Hand a -> Boolean', () => {
  // Setoid laws
  const reflexivity = setoid.reflexivity(Hand.from)(equals)(['TH'])
  const symmetry = setoid.symmetry(Hand.from)(equals)(['TH'])
  const transitivity = setoid.transitivity(Hand.from)(equals)(['TH'])

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Hand.reduce :: Foldable f => Hand a ~> ((b, a) -> b, b) -> b', () => {
  const f = Hand.from(['2H', '3D', '8H', '7H', '6H'])
  const g = Hand.from(['AH', 'KD', 'QH', 'JH', 'TH'])
  const a = f.reduce(identity, Hand.from)
  const b = g.toArray().reduce(identity, Hand.from)
  const associativity = equals(a, b)

  expect(associativity).toBe(true)
})
