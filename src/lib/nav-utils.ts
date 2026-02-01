export function isLinkActive(pathname: string, link: string): boolean {
  // Normalize paths by removing trailing slashes and ensuring consistent starting slash
  const cleanPathname = pathname.replace(/\/$/, "") || "/";
  const cleanLink = link.replace(/\/$/, "") || "/";

  // Exact match
  if (cleanPathname === cleanLink) {
    return true;
  }

  // Nested match logic
  // If the link is the root dashboard "/dashboard", it shouldn't match nested routes automatically 
  // unless we specifically want that behavior. Usually, for a sidebar, exact match is better for root,
  // or we need to be careful not to match "/dashboard-settings" if link is "/dashboard".
  // The check cleanPathname.startsWith(cleanLink + "/") ensures we match sub-paths like /dashboard/settings
  // but not /dashboard-settings.
  if (cleanLink !== "/dashboard" && cleanPathname.startsWith(cleanLink + "/")) {
    return true;
  }

  // Special case: If we are at "/dashboard/something" and the link is "/dashboard", 
  // usually we strictly want the Dashboard link active only on exact match or we treat it as home.
  // The prompt implies: "ensure /dashboard doesn't match every sub-route by checking if the link is specifically the root dashboard"
  // So: if cleanLink is "/dashboard", we rely on exact match above.
  
  // However, often sidebars behave like:
  // /dashboard -> Dashboard (Active)
  // /dashboard/profile -> Dashboard (Inactive), Profile (Active)
  
  // But if the link is a SECTION header like "/settings" and we are at "/settings/security", it should be active.
  if (cleanLink !== "/dashboard" && cleanPathname.startsWith(cleanLink)) {
     // Additional safety: check if the next char is a slash or end of string
     const remainder = cleanPathname.slice(cleanLink.length);
     return remainder === "" || remainder.startsWith("/");
  }

  return false;
}
