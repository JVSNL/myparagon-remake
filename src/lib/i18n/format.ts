export type Params = Record<string, string | number>

const PLURAL = /\{(\w+), plural, ((?:\w+ \{[^}]*\}\s*)+)\}/g
const CASE = /(\w+) \{([^}]*)\}/g

/**
 * Minimal ICU-style formatter: `{name}` placeholders and
 * `{n, plural, one {# item} other {# items}}`.
 */
export function format(message: string, params: Params = {}, locale = 'nl'): string {
  const rules = new Intl.PluralRules(locale)
  const withPlurals = message.replace(PLURAL, (_, key: string, cases: string) => {
    const value = Number(params[key] ?? 0)
    const options = Object.fromEntries([...cases.matchAll(CASE)].map((m) => [m[1], m[2]]))
    const chosen = options[`=${value}`] ?? options[rules.select(value)] ?? options.other ?? ''
    return chosen.replace(/#/g, value.toLocaleString(locale))
  })
  return withPlurals.replace(/\{(\w+)\}/g, (match, key: string) => (key in params ? String(params[key]) : match))
}
