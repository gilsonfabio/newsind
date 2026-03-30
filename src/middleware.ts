import NextAuth from "next-auth";

const { auth: middleware } = NextAuth({
  providers: [],
});

export { middleware };

export const config = {
  matcher: ["/dashboard/:path*"],
};