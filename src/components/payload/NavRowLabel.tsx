'use client'

import { useRowLabel } from '@payloadcms/ui'

export const NavRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  return <>{data?.label || `Nav item ${(rowNumber ?? 0)}`}</>
}

export default NavRowLabel