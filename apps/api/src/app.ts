import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { generalLimiter } from './middleware/rate-limit';
import { errorHandler } from './middleware/error-handler';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { wishlistRouter } from './routes/wishlist.routes';
import { productRouter } from './routes/product.routes';
import { userRouter } from './routes/user.routes';

const app: Express = express();

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/user', userRouter);

// Error handling
app.use(errorHandler);

export { app };
