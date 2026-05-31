---
name: Admin auth redirect race
description: Why admin login/logout must use full-page navigation, not SPA routing
---

# Admin auth redirect race

After a successful admin login, redirect to the dashboard with a full-page
navigation (`window.location.href = ${import.meta.env.BASE_URL}admin/...`),
NOT a wouter `setLocation`. Same for logout.

**Why:** `AdminAuthProvider`'s `/admin/me` query is gated by
`enabled: !!localStorage.getItem("esh_admin_token")`. That flag is read at
provider render time and is NOT reactive — writing the token to localStorage
and doing an in-SPA route change does not re-render the provider, so `enabled`
stays `false`, `/admin/me` never fires, and `AdminLayout`'s guard sees
`isAuthenticated=false` and bounces straight back to `/admin/login`. Symptom:
login returns 200 + token stored, no error, but the page stays on the login
screen. A full reload re-mounts the provider with the token already present,
so the query runs and the guard passes.

**How to apply:** Any future in-app token set/refresh that avoids a hard
reload will reintroduce this bug. The robust long-term fix is to make auth
state reactive (token in React state/context or an explicit refetch/enable),
after which SPA navigation would be safe. Use `import.meta.env.BASE_URL` for
these redirects so subpath deployments keep working.
