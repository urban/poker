// @flow
import {equals, identity} from 'ramda'
import setoid from 'fantasy-land/laws/setoid'
import ord from 'fantasy-land/laws/ord'
import Card from './Card'
import Rank from './Rank'
import Suit from './Suit'

test('Card.of :: Int -> Card', () => {
  const rank = Rank.of(10)
  const suit = Suit.of('H')
  const a = Card.of(rank, suit)
  const b = new Card(rank, suit)
  expect(equals(a, b)).toBe(true)
})

test('Card.is :: Any -> Boolean', () => {
  const a = Card.from('TH')
  expect(Card.is(a)).toBe(true)
})

test('Card.from :: String -> Card', () => {
  const a = Card.of(Rank.of(10), Suit.of('H'))
  const b = Card.from('TH')
  expect(equals(a, b)).toBe(true)
})

test('Card#isAce :: Card a ~> Boolean', () => {
  const a = Card.from('AH')
  const b = Card.from('TH')
  expect(a.isAce).toBe(true)
  expect(b.isAce).toBe(false)
})

test('Card.toString :: Card a ~> () -> String', () => {
  const a = Card.from('TH')
  const showable = equals(a.toString(), 'Card(Rank(10), Suit(H))')

  expect(showable).toBe(true)
})

test('Card.equals :: Setoid a => Card a ~> Card a -> Boolean', () => {
  // Setoid laws
  const reflexivity = setoid.reflexivity(Card.from)(equals)('TH')
  const symmetry = setoid.symmetry(Card.from)(equals)('TH')
  const transitivity = setoid.transitivity(Card.from)(equals)('TH')

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Card.lte :: Ord a => Card a ~> Card a -> Boolean', () => {
  // Ord laws
  const f = Card.from('TH')
  const g = Card.from('TH')
  const h = Card.from('TH')
  const totality = ord.totality(equals)(f)(g)
  const antisymmetry = ord.antisymmetry(equals)(f)(g)
  const transitivity = ord.transitivity(equals)(f)(g)(h)

  expect(totality).toBe(true)
  expect(antisymmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('Card.reduce :: Foldable f => Card a ~> ((b, a) -> b, b) -> b', () => {
  const f = Card.from('TH')
  const g = Card.from('TH')
  const a = f.reduce(identity, Card.from)
  const b = g.toArray().reduce(identity, Card.from)
  const associativity = equals(a, b)

  expect(associativity).toBe(true)
})
