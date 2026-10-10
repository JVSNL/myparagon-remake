// localStorage can be unavailable (private mode, blocked storage), so every
// access is guarded and failures fall back to in-memory behaviour.

export const readJson = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the demo keeps working, it just won't persist.
  }
}
