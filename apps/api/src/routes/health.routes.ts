import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export { router as healthRouter };
