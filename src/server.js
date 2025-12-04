// server.js (en la raíz)
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import taskRoutes from './src/routes/task.routes.js';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

// Configuración CORS para Vercel
const FRONTEND_URLS = [
    'http://localhost:5173', // desarrollo local
    'https://to-do-ceja-cuevas-front.vercel.app' // producción en Vercel
];

app.use(cors({
    origin: FRONTEND_URLS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// Middleware para preflight
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.get('/', (req, res) => res.json({ ok: true, name: 'todo-pwa-api' }));
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-pwa';

// Conectar a MongoDB y arrancar servidor
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
            console.log(`🌐 Frontend permitido: ${FRONTEND_URLS.join(', ')}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos', err);
        process.exit(1);
    });

export default app;