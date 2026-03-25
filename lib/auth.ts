import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          return null;
        }

        // Try to find user by email or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.emailOrPhone },
              { phone: credentials.emailOrPhone }
            ]
          }
        });

        if (!user) {
          return null;
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          return null;
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
