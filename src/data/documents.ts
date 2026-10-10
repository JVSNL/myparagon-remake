import expenseProcess from '../assets/docs/expense-process.pdf?url'
import houseRules from '../assets/docs/house-rules.pdf?url'
import iso9001 from '../assets/docs/iso-9001.pdf?url'
import travelPolicy from '../assets/docs/travel-policy.pdf?url'

export interface DocumentInfo {
  id: string
  name: string
  url: string
  /** Size in bytes, shown next to the file name. */
  size: number
}

// Fictional example documents bundled with the app.
export const DOCUMENTS: DocumentInfo[] = [
  { id: 'expense-process', name: 'Declaraties_indienen.pdf', url: expenseProcess, size: 46_955 },
  { id: 'travel-policy', name: 'Reisbeleid.pdf', url: travelPolicy, size: 37_919 },
  { id: 'iso-9001', name: 'Certificaat_ISO_9001.pdf', url: iso9001, size: 38_439 },
  { id: 'house-rules', name: 'Huisregels_kantoor.pdf', url: houseRules, size: 38_361 },
]

export const documentById = (id: string) => DOCUMENTS.find((d) => d.id === id)
