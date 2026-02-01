export function isLinkActive(pathname: string, link: string): boolean {
  const cleanPathname = pathname.endsWith("/") && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;
    
  const cleanLink = link.endsWith("/") && link.length > 1 
    ? link.slice(0, -1) 
    : link;

  if (cleanPathname === cleanLink) {
    return true;
  }

  // Prevent root "/dashboard" from matching everything like "/dashboard/settings"
  // unless that is the desired behavior (usually distinct links for subpages).
  // The prompt says: "ensure /dashboard doesn't match every sub-route"
  if (cleanLink === "/dashboard") {
    return false;
  }

  return cleanPathname.startsWith(cleanLink);
}