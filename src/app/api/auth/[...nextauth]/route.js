import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';

export const authOptions = {
  providers: [
    // Admin Provider
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const admin = await Admin.findOne({ email: credentials.email });
          
          if (!admin) throw new Error('Invalid admin credentials');

          const isMatch = await bcrypt.compare(credentials.password, admin.password);
          if (!isMatch) throw new Error('Invalid admin credentials');

          if (!admin.isVerified) {
             // Auto-verify in development
             if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
                return { 
                  id: admin._id.toString(), 
                  name: admin.name, 
                  email: admin.email,
                  role: 'admin'
                };
             }
             throw new Error('Please verify your email first');
          }

          return { 
            id: admin._id.toString(), 
            name: admin.name, 
            email: admin.email,
            role: 'admin'
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
    // User Provider
    CredentialsProvider({
      id: 'user-login',
      name: 'User Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) throw new Error('Invalid credentials');

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) throw new Error('Invalid credentials');

          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email,
            role: 'user'
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Default login page
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
