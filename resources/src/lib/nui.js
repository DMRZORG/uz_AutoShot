export async function fetchNUI(eventName, data = {}) {
  try {
    const response = await fetch(`https://uz_AutoShot/${eventName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch {
    return null
  }
}
