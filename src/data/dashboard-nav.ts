import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { unstable_cache } from 'next/cache'
import type { DashboardNav } from '@/payload-types'

export const getDashboardNav = async (locale: string = 'en'): Promise<DashboardNav> => {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      try {
        const nav = await payload.findGlobal({
          slug: 'dashboard-nav',
          locale: locale as any,
          depth: 1,
        })
        return nav
      } catch (error) {
        console.error('Error fetching dashboard nav data:', error)
        throw error
      }
    },
    ['global_dashboard-nav', locale],
    { tags: ['global_dashboard-nav'] }
  )()
}
