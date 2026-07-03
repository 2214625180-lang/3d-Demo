export function toArray(value) {
  return Array.isArray(value) ? value : []
}

export function toSafeNumber(value, fallbackValue = 0) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallbackValue
}

export function formatNumber(value) {
  return toSafeNumber(value, 0).toLocaleString('en-US')
}

export function getTabValue(tabs, preferredValue) {
  const normalizedTabs = toArray(tabs)
  const hasPreferredValue = normalizedTabs.some((tab) => tab && tab.value === preferredValue)

  if (hasPreferredValue) {
    return preferredValue
  }

  return normalizedTabs[0] && normalizedTabs[0].value ? normalizedTabs[0].value : ''
}
