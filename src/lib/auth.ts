import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // Check if this user has a paid order
        const order = await prisma.order.findFirst({
          where: { email: user.email.toLowerCase(), status: "paid" },
        });
        if (!order) {
          // No paid order: block sign-in
          return "/signin?error=no_order";
        }

        // Ensure user record exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              name: user.name,
              image: user.image,
            },
          });
          // Link the order
          await prisma.order.updateMany({
            where: { email: user.email.toLowerCase(), userId: null },
            data: { userId: newUser.id },
          });
        } else {
          // Link any unlinked orders
          await prisma.order.updateMany({
            where: { email: user.email.toLowerCase(), userId: null },
            data: { userId: existingUser.id },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      // For Google sign-in, look up the actual DB user ID
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
