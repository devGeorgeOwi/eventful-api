import { Router } from 'express';
import { authController } from './auth.controller';
// import passport from 'passport';
// import '../../config/passport';
import { authService } from './auth.service';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));

// Google OAuth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: '/login' }),
//   (req, res) => {
//     const tokens = authService.generateTokens(req.user!.id, req.user!.role);
//     res.redirect(`/auth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
//   }
// );

export { router as authRoutes };