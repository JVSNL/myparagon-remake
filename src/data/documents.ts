import financeOrganogram from '../assets/docs/finance-organogram.pdf?url'
import houseRules from '../assets/docs/house-rules.pdf?url'
import iso27001 from '../assets/docs/iso-27001.pdf?url'
import purchaseProcess from '../assets/docs/purchase-process.pdf?url'

export interface DocumentInfo {
  id: string
  name: string
  url: string
  /** Size in bytes, shown next to the file name. */
  size: number
}

// Fictional example documents bundled with the app.
export const DOCUMENTS: DocumentInfo[] = [
  { id: 'finance-organogram', name: 'Finance_Organogram.pdf', url: financeOrganogram, size: 43_455 },
  { id: 'purchase-process', name: 'Proces_inkoopfacturen.pdf', url: purchaseProcess, size: 44_491 },
  { id: 'iso-27001', name: 'Certificaat_ISO_27001.pdf', url: iso27001, size: 38_212 },
  { id: 'house-rules', name: 'Huisregels_kantoor.pdf', url: houseRules, size: 38_587 },
]

export const documentById = (id: string) => DOCUMENTS.find((d) => d.id === id)
