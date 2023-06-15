import { NextResponse } from 'next/server';
import NextAuth, { AuthOptions, getServerSession, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/db/mongodb';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';

const adminEmails: string[] = ['dawid.paszko@gmail.com'];

export const authOptions: AuthOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) => {
      const userEmail = session?.user?.email as string;
      if (adminEmails.includes(userEmail)) {
        return session;
      } else {
        return session;
      }
    },
  },
};

export async function isAdminRequest(req: Request) {
  const session = await getServerSession(authOptions);

  if (!adminEmails.includes(session?.user?.email as string)) {
    return new NextResponse('Not an admin', { status: 401 });
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as PUT };
