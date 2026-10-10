// Photos uploaded from the device. They live in IndexedDB rather than localStorage,
// which has a ~5 MB limit that a handful of photos would exhaust.

const DB_NAME = 'mynexora-images'
const STORE = 'images'

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const run = async <T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const request = fn(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const saveImage = (id: string, blob: Blob) => run('readwrite', (s) => s.put(blob, id))
export const loadImage = (id: string) => run<Blob | undefined>('readonly', (s) => s.get(id))
export const clearImages = () => run('readwrite', (s) => s.clear()).catch(() => undefined)

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024
const MAX_SIDE = 1600

/** Scales a photo down to at most 1600px and re-encodes it as JPEG. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))), 'image/jpeg', 0.82),
  )
}
