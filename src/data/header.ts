import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { unstable_cache } from 'next/cache'
import type { Header } from '@/payload-types'

export const getHeader = async (locale: string = 'en'): Promise<Header> => {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      try {
        const header = await payload.findGlobal({
          slug: 'header',
          locale: locale as any,
          depth: 1,
        })
        return header
      } catch (error) {
        // Log the error but return null or a default object to prevent crashing
        console.error('Error fetching header data:', error)
        // Return a partial structure or handle essentially, strictly typing strictly requires Header
        // In a real scenario, you might want to return null and handle it in the UI.
        // For now, let's allow it to throw or return what findGlobal returns (which might be null/undefined if not found?)
        // Payload findGlobal usually returns the global document.
        throw error
      }
    },
    ['global_header', locale],
    { tags: ['global_header'] }
  )()
}
