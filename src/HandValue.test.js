// @flow
import {equals, map} from 'ramda'
import setoid from 'fantasy-land/laws/setoid'
import Card from './Card'
import HandValue from './HandValue'

test('HandValue.of :: Card a => [a] -> HandValue', () => {
  const xs = map(Card.from, ['TH', '9H', '8H', '7H', '6H'])
  const a = HandValue.of(xs)
  const b = new HandValue(xs)

  expect(equals(a, b)).toBe(true)
})

// test('HandValue.is :: Any -> Boolean', () => {
//   const xs = map(Card.from, ['TH', '9H', '8H', '7H', '6H'])
//   const a = HandValue.of(xs)
//   const b = xs[0]

//   expect(HandValue.is(a)).toBe(true)
//   expect(HandValue.is(b)).toBe(false)
// })

// test('HandValue.toString :: HandValue a ~> () -> String', () => {
//   const xs = map(Card.from, ['2H', '3D', '8H', '7H', '6H'])
//   const a = HandValue.of(xs)
//   const showable = equals(a.toString(), 'HandValue(0)')

//   expect(showable).toBe(true)
// })

// test('HandValue.isHighCard :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '3D', '8H', '7H', '6H'])
//   const a = HandValue.of(xs)

//   expect(a.isHighCard()).toBe(true)
// })

// test('HandValue.isPair :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '2D', '8H', '7H', '6H'])
//   const a = HandValue.of(xs)

//   expect(a.isPair()).toBe(true)
// })

// test('HandValue.isTwoPair :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '2D', '8H', '8D', '6H'])
//   const a = HandValue.of(xs)
//   expect(a.isTwoPair()).toBe(true)
// })

// test('HandValue.isThreeOfAKind :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '2D', '2S', '8D', '6H'])
//   const a = HandValue.of(xs)

//   expect(a.isThreeOfAKind()).toBe(true)
// })

// test('HandValue.isStraight :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '3H', '4H', '5H', '6D'])
//   const a = HandValue.of(xs)

//   expect(a.isStraight()).toBe(true)
// })

// test('HandValue.isFlush :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '3H', '8H', '7H', '6H'])
//   const a = HandValue.of(xs)

//   expect(a.isFlush()).toBe(true)
// })

// test('HandValue.isFullHouse :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '2D', '2S', '8D', '8H'])
//   const a = HandValue.of(xs)

//   expect(a.isFullHouse()).toBe(true)
// })

// test('HandValue.isFourOfAKind :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '2D', '2S', '2C', '8H'])
//   const a = HandValue.of(xs)

//   expect(a.isFourOfAKind()).toBe(true)
// })

// test('HandValue.isStraightFlush :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['2H', '3H', '4H', '5H', '6H'])
//   const a = HandValue.of(xs)

//   expect(a.isStraightFlush()).toBe(true)
// })
// test('HandValue.isRoyalFlush :: HandValue a ~> () -> Boolean', () => {
//   const xs = map(Card.from, ['QH', 'JH', 'AH', 'KH', 'TH'])
//   const a = HandValue.of(xs)

//   expect(a.isRoyalFlush()).toBe(true)
// })
