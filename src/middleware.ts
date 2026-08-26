import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|fr|ar|es)/:path*", "/((?!api|legal|_next|_vercel|.*\\..*).*)"],
};
