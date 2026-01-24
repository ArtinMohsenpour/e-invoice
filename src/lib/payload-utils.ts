import { getPayload } from 'payload'
import configPromise from '@/payload.config'

// Define a safe type for the Header data since payload-types might not be regenerated yet
export interface HeaderData {
  logo?: {
    url?: string
    alt?: string
    [key: string]: any
  } | string | null
  companyName?: string | null
  navItems?: {
    type: 'single' | 'dropdown'
    label: string
    link?: string | null
    subMenu?: {
      label: string
      url: string
      id?: string | null
    }[] | null
    id?: string | null
  }[] | null
  [key: string]: any
}

export const getHeaderData = async (locale: string = 'en'): Promise<HeaderData> => {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const header = await payload.findGlobal({
      slug: 'header',
      locale: locale as any, // Cast to any to avoid strict locale type issues if not generated
      depth: 1,
    })
    return header as HeaderData
  } catch (error) {
    console.error('Error fetching header data:', error)
    return {}
  }
}
