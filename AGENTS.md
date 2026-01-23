I have successfully updated the authentication configuration to ensure tokens are deleted automatically after 8 hours.

**Changes made:**

1.  **`src/collections/Users.ts`**:
    *   Set `auth.tokenExpiration` to `28800` seconds (8 hours).

2.  **`src/app/[locale]/(frontend)/actions/auth.ts`**:
    *   Updated `loginAction` to set the `payload-token` cookie with `maxAge: 28800` (8 hours).
    *   Updated `resetPasswordAction` to set the `payload-token` cookie with `maxAge: 28800` (8 hours).

The token will now effectively expire and be removed from the browser after 8 hours, or immediately upon logout.