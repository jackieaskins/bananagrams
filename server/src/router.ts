import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Server is up and running!');
});

export default router;
