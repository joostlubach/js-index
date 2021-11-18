import {camelCase, upperFirst, snakeCase, kebabCase, startCase} from 'lodash'

export interface Options {
  quotes?: 'double' | 'single'
}

export interface Interpolation {
  replacement: string
  options:     InterpolationOptions
}

export interface InterpolationOptions {
  quoted?: boolean
}

const INTERPOLATION_REGEXP = /(?:\\)?\$\{(.*?)\}/g
const PARSE_REGEXP = /^(.*?)(?:\/(.+)\/(.*)\/(.*?))?(?::(.*))?$/

const MODIFIERS = {
  lower:  (s: string) => s.toLowerCase(),
  upper:  (s: string) => s.toUpperCase(),
  camel:  camelCase,
  pascal: (s: string) => upperFirst(camelCase(s)),
  kebab:  kebabCase,
  snake:  snakeCase,
  dot:    (s: string) => kebabCase(s).replace(/-/g, '.'),
  title:  startCase,
}

export default class Interpolator {

  constructor(readonly options: Options = {}) {}

  readonly interpolations: {[placeholder: string]: Interpolation} = {}
  
  add(placeholder: string, replacement: string, options: InterpolationOptions = {}) {
    this.interpolations[placeholder] = {replacement, options}
  }

  interpolate(string: string) {
    return string.replace(INTERPOLATION_REGEXP, (all, content) => {
      const match = content.match(PARSE_REGEXP)
      if (match == null) { return all }

      if (all.charAt(0) === '\\') {
        return all.slice(1)
      }

      const [, name, search, replace, reModifiers, rest = ''] = match
      const interpolation = this.interpolations[name]
      if (interpolation == null) { return all }

      const params = rest.split(':')
      const quoted = interpolation.options.quoted || params.indexOf('quoted') !== -1
      const modifiers = params.map(p => MODIFIERS[p]).filter(Boolean)

      let replacement = interpolation.replacement
      if (search) {
        const regexp = new RegExp(search, reModifiers)
        replacement = replacement.replace(regexp, replace)
      }
      for (const modifier of modifiers) {
        replacement = modifier(replacement)
      }
      if (quoted) {
        replacement = this.quote(replacement)
      }

      return replacement
    })
  }

  quote(string: string) {
    if (this.options.quotes === 'double') {
      return `"${string.replace('"', '\\"')}"`
    } else {
      return `'${string.replace('\'', '\\\'')}'`
    }
  }

}