import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match `/` and unprefixed routes so English can live at `/` (as-needed).
  // Keep /pair and /legal out of locale routing.
  matcher: ["/", "/(en|fr|ar|es)/:path*", "/((?!api|legal|pair|_next|_vercel|.*\\..*).*)"],
};
