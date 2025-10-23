import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "investor@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        let client;
        try {
          // Connect to MongoDB
          client = await MongoClient.connect(process.env.MONGODB_URI!);
          const db = client.db("InvestorPortal"); // Your database name
          
          // Find user by email
          const user = await db.collection("UserLogins").findOne({ email: credentials.email });
          console.log("[NextAuth] User lookup:", user);
          
          if (user) {
            // Validate password using bcrypt
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            console.log("[NextAuth] Password valid:", isValid);
            if (isValid) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Database connection error:", error);
          return null;
        } finally {
          if (client) {
            await client.close();
          }
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
