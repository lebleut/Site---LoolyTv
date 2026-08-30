import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Keep /pair unprefixed (QR deep links). Same pattern as /legal.
  matcher: ["/", "/(en|fr|ar|es)/:path*", "/((?!api|legal|pair|_next|_vercel|.*\\..*).*)"],
};
