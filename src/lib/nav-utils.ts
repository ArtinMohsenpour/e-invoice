export function isLinkActive(pathname: string, link: string): boolean {
  // 1. Resolve Target Link
  //    Handle CMS relative links:
  //    "" or " " -> "/dashboard"
  //    "settings" -> "/dashboard/settings"
  let targetLink = link.trim();
  
  if (!targetLink.startsWith("/")) {
    if (targetLink === "") {
      targetLink = "/dashboard";
    } else {
      targetLink = `/dashboard/${targetLink}`;
    }
  }

  // 2. Normalize Pathname (Handle Locales)
  //    If pathname includes locale (e.g. "/en/dashboard"), strip it to compare against logical paths.
  let cleanPath = pathname;
  // Regex matches start of string, slash, 2 letters, and either end of string or another slash
  const localePrefix = cleanPath.match(/^\/[a-z]{2}(\/|$)/);
  
  if (localePrefix) {
    // Remove the "/en" part. If result is empty (was just "/en"), make it "/".
    cleanPath = cleanPath.replace(/^\/[a-z]{2}/, "") || "/";
  }
  
  // Normalize trailing slashes for both
  cleanPath = cleanPath.replace(/\/+$/, "") || "/";
  targetLink = targetLink.replace(/\/+$/, "") || "/";

  // 3. Match Logic

  // Case A: Root Dashboard Link
  // It should ONLY match if the path is exactly "/dashboard".
  // It should NOT match "/dashboard/generate".
  if (targetLink === "/dashboard") {
    return cleanPath === "/dashboard";
  }

  // Case B: Other Links (e.g. "/dashboard/settings")
  // 1. Exact match (e.g. "/dashboard/settings")
  if (cleanPath === targetLink) {
    return true;
  }
  
  // 2. Sub-path match (e.g. "/dashboard/settings/profile")
  //    Must ensure it's a directory match (followed by /)
  return cleanPath.startsWith(`${targetLink}/`);
}
