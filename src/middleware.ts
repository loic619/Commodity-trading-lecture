import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkModuleKey, moduleCookieName } from '@/lib/moduleAccess'
import { isModuleSlug } from '@/lib/moduleSlugs'

/**
 * Invitation links are redeemed here, and only here.
 *
 * A Server Component cannot set a cookie in Next's App Router, so the page
 * can only ever READ the unlock. Redeeming `?k=` therefore happens in
 * middleware: it sets the httpOnly cookie on a redirect to the same path
 * without the key, so the credential never lingers in the address bar, in a
 * screenshot, or in the history of a shared laptop.
 *
 * Everything else passes straight through — the page itself decides whether
 * the visitor may see the module.
 */
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const key = searchParams.get('k')
  if (!key) return NextResponse.next()

  // /m/<slug>/...
  const slug = pathname.split('/')[2]
  if (!slug || !isModuleSlug(slug) || !checkModuleKey(slug, key)) return NextResponse.next()

  const clean = req.nextUrl.clone()
  clean.searchParams.delete('k')
  const res = NextResponse.redirect(clean)
  res.cookies.set(moduleCookieName(slug), 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 180, // one opening per device, for the academic term
  })
  return res
}

export const config = {
  matcher: ['/m/:path*'],
}
