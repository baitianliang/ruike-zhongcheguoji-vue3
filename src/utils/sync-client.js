const CLIENT_ID =
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
const baseUrl = process.env.VUE_APP_API_BASE_URL

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export function getClientId() {
  return CLIENT_ID
}

export function loadSharedWorkbook() {
  return requestJson(baseUrl + 'api/workbook')
}

export function saveSharedWorkbook(snapshot) {
  const body = JSON.stringify({
    clientId: CLIENT_ID,
    snapshot,
  })
  console.log('save workbook url:', baseUrl + 'api/workbook')
  console.log('save workbook body size:', body.length)
  return requestJson(baseUrl + 'api/workbook', {
    method: 'POST',
    body,
  })
}

export function saveSharedCommand(command) {
  return requestJson(baseUrl + 'api/commands', {
    method: 'POST',
    body: JSON.stringify({
      clientId: CLIENT_ID,
      command,
    }),
  })
}

let sharedEventSource = null
export function subscribeSharedWorkbook({ onCommand, onSnapshot, onStatus }) {
  if (sharedEventSource) {
    sharedEventSource.close()
    sharedEventSource = null
  }

  const eventSource = new EventSource(baseUrl + 'api/events')
  sharedEventSource = eventSource

  eventSource.onopen = () => {
    onStatus?.('同步通道已连接')
  }

  eventSource.onerror = () => {
    onStatus?.('同步通道重连中')
  }

  eventSource.addEventListener('workbook:snapshot', (event) => {
    onSnapshot?.(JSON.parse(event.data))
  })

  eventSource.addEventListener('workbook:command', (event) => {
    onCommand?.(JSON.parse(event.data))
  })

  return () => {
    if (sharedEventSource === eventSource) {
      sharedEventSource = null
    }
    eventSource.close()
  }
}

// export function subscribeSharedWorkbook({ onCommand, onSnapshot, onStatus }) {
//   const eventSource = new EventSource(baseUrl + 'api/events')

//   eventSource.onopen = () => {
//     onStatus?.('同步通道已连接')
//   }

//   eventSource.onerror = () => {
//     onStatus?.('同步通道重连中')
//   }

//   eventSource.addEventListener('workbook:snapshot', (event) => {
//     onSnapshot?.(JSON.parse(event.data))
//   })

//   eventSource.addEventListener('workbook:command', (event) => {
//     onCommand?.(JSON.parse(event.data))
//   })

//   return () => {
//     eventSource.close()
//   }
// }
