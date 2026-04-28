import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            google_id: user.id,
          }),
        });
        const data = await response.json();
        if (data.user) {
          (user as any).rol = data.user.rol;
        }
        return true;
      } catch (error) {
        console.error('Error syncing user:', error);
        return true;
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.rol = (user as any).rol;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).rol = token.rol;
      }
      return session;
    },
  },
};
