import { getLocale } from 'next-intl/server'
import { getHeaderData } from '@/lib/payload-utils'
import { NavbarClient } from './NavbarClient'

export const Navbar = async () => {
  const locale = await getLocale()
  const headerData = await getHeaderData(locale)

  return <NavbarClient data={headerData} />
}
