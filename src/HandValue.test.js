// @flow
import {compose, equals, identity, map} from 'ramda'
import setoid from 'fantasy-land/laws/setoid'
import ord from 'fantasy-land/laws/ord'
import Card from './Card'
import HandValue, {
  isSequential,
  numberInSameRank,
  numberInSameSuit,
} from './HandValue'

test('numberInSameRank', () => {
  const toCards = map(Card.from)
  const xs = [
    ['TH', '9H', '8H', '7H', '6H'],
    ['TH', '9H', '8H', '7H', 'TD'],
    ['TH', '9H', 'TD', '9D', '6H'],
    ['TH', 'TC', '7H', '7C', '7D'],
    ['TH', '7S', '7H', '7C', '7D'],
  ]

  const a = [[1, 1, 1, 1, 1], [2, 1, 1, 1], [2, 2, 1], [3, 2], [4, 1]]
  const b = map(compose(numberInSameRank, toCards), xs)

  expect(equals(a, b)).toBe(true)
})

test('numberInSameSuit', () => {
  const toCards = map(Card.from)
  const xs = [
    ['TH', '9H', '8H', '7H', '6H'],
    ['TH', '9H', '8H', '7H', 'TD'],
    ['TH', '9H', 'TD', '9D', '6H'],
    ['TH', 'TC', '7H', '7C', '7D'],
    ['TH', '7S', '7H', '7C', '7D'],
  ]

  const a = [[5], [4, 1], [3, 2], [2, 2, 1], [2, 1, 1, 1]]
  const b = map(compose(numberInSameSuit, toCards), xs)

  expect(equals(a, b)).toBe(true)
})

test('isSequential', () => {
  const toCards = map(Card.from)
  const xs = [
    ['6H', '9H', '8H', '7H', 'TH'],
    ['TH', '9H', '8H', '7H', 'TD'],
    ['5H', '9H', '8H', '7H', 'TD'],
    ['AH', 'QH', 'KH', 'JH', 'TD'],
    ['4H', 'AH', '3H', '2H', '5D'],
  ]

  const a = [true, false, false, true, true]
  const b = map(compose(isSequential, toCards), xs)

  expect(equals(a, b)).toBe(true)
})

test('HandValue.of :: Card a => [a] -> HandValue', () => {
  const xs = map(Card.from, ['TH', '9H', '8H', '7H', '6H'])
  const a = HandValue.of(xs)
  const b = new HandValue(xs)
  expect(equals(a, b)).toBe(true)
})

test('HandValue.is :: Any -> Boolean', () => {
  const xs = map(Card.from, ['TH', '9H', '8H', '7H', '6H'])
  const a = HandValue.of(xs)
  const b = xs[0]

  expect(HandValue.is(a)).toBe(true)
  expect(HandValue.is(b)).toBe(false)
})

test('HandValue.toString :: HandValue a ~> () -> String', () => {
  const xs = map(Card.from, ['2H', '3D', '8H', '7H', '6H'])
  const a = HandValue.of(xs)
  const showable = equals(a.toString(), 'HandValue(0)')

  expect(showable).toBe(true)
})

test('HandValue.equals :: Setoid a => HandValue a ~> HandValue a -> Boolean', () => {
  const xs = map(Card.from, ['TH', 'JH', 'QH', 'KH', 'AH'])
  // Setoid laws
  const reflexivity = setoid.reflexivity(HandValue.of)(equals)(xs)
  const symmetry = setoid.symmetry(HandValue.of)(equals)(xs)
  const transitivity = setoid.transitivity(HandValue.of)(equals)(xs)

  expect(reflexivity).toBe(true)
  expect(symmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('HandValue.lte :: Ord a => HandValue a ~> HandValue a -> Boolean', () => {
  const xs = map(Card.from, ['2H', '3D', '8H', '7H', '6H'])
  // Ord laws
  const f = HandValue.of(xs)
  const g = HandValue.of(xs)
  const h = HandValue.of(xs)
  const totality = ord.totality(equals)(f)(g)
  const antisymmetry = ord.antisymmetry(equals)(f)(g)
  const transitivity = ord.transitivity(equals)(f)(g)(h)

  expect(totality).toBe(true)
  expect(antisymmetry).toBe(true)
  expect(transitivity).toBe(true)
})

test('HandValue.isHighCard :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '3D', '8H', '7H', '6H'])
  const a = HandValue.of(xs)

  expect(a.isHighCard()).toBe(true)
})

test('HandValue.isPair :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '2D', '8H', '7H', '6H'])
  const a = HandValue.of(xs)

  expect(a.isPair()).toBe(true)
})

test('HandValue.isTwoPair :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '2D', '8H', '8D', '6H'])
  const a = HandValue.of(xs)
  expect(a.isTwoPair()).toBe(true)
})

test('HandValue.isThreeOfAKind :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '2D', '2S', '8D', '6H'])
  const a = HandValue.of(xs)

  expect(a.isThreeOfAKind()).toBe(true)
})

test('HandValue.isStraight :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '3H', '4H', '5H', '6D'])
  const a = HandValue.of(xs)

  expect(a.isStraight()).toBe(true)
})

test('HandValue.isFlush :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '3H', '8H', '7H', '6H'])
  const a = HandValue.of(xs)

  expect(a.isFlush()).toBe(true)
})

test('HandValue.isFullHouse :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '2D', '2S', '8D', '8H'])
  const a = HandValue.of(xs)

  expect(a.isFullHouse()).toBe(true)
})

test('HandValue.isFourOfAKind :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '2D', '2S', '2C', '8H'])
  const a = HandValue.of(xs)

  expect(a.isFourOfAKind()).toBe(true)
})

test('HandValue.isStraightFlush :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['2H', '3H', '4H', '5H', '6H'])
  const a = HandValue.of(xs)

  expect(a.isStraightFlush()).toBe(true)
})

test('HandValue.isRoyalFlush :: HandValue a ~> () -> Boolean', () => {
  const xs = map(Card.from, ['QH', 'JH', 'AH', 'KH', 'TH'])
  const a = HandValue.of(xs)

  expect(a.isRoyalFlush()).toBe(true)
})
