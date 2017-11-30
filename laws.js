// @flow
import {add, compose, equals, identity} from 'ramda'
import fl from 'fantasy-land'

export const setoid = (t: Function) => (x: any) => {
  const a = t(x)
  const b = t(x)
  const c = t(x)
  const reflexivity = equals(a[fl.equals](a), true)
  const symmetry = equals(a[fl.equals](b), b[fl.equals](a))
  const transitivity = equals(
    a[fl.equals](b) && b[fl.equals](c),
    a[fl.equals](c)
  )

  return {
    reflexivity,
    symmetry,
    transitivity,
  }
}

export const ord = (t: Function) => (x: any) => {
  const a = t(x)
  const b = t(x)
  const c = t(x)
  const totality = equals(a.lte(b) || b.lte(a), true)
  const antisymmetry = equals(a.lte(b) && b.lte(a), a.equals(b))
  const transitivity = equals(a.lte(b) && b.lte(c), a.lte(c))

  return {
    totality,
    antisymmetry,
    transitivity,
  }
}

export const functor = (t: Function) => (f: Function) => (g: Function) => (
  x: number
) => {
  const a = t(2)
  const _identity = equals(a.map(identity), a)
  const composition = equals(a.map(x => f(g(x))), a.map(f).map(g))

  return {
    identity: _identity,
    composition,
  }
}
