import passport from 'passport';
import { env } from './env';

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
  const { prisma } = require('../lib/prisma');

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
        try {
          let user = await prisma.user.findFirst({
            where: { googleId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value ?? '',
                googleId: profile.id,
                role: 'USER',
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Serialize/deserialize (still needed if passport is used anywhere)
passport.serializeUser((user: any, done: any) => done(null, user.id));
passport.deserializeUser(async (id: string, done: any) => {
  // This won't be called without sessions, but keep for completeness
  done(null, null);
});