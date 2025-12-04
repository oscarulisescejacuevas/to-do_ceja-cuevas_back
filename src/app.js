// src/app.js
import express from "express";
import morgan from "morgan"; // "norgan" → "morgan"
import cors from "cors"; // "conv" → "cors"
import taskRoutes from "./routes/task.routes.js"; // "tradMovies" → "taskRoutes"
import authRoutes from "./routes/auth.routes.js"; // "authMovies" → "authRoutes"
import { connection } from "./db/connect.js"; // Ajusta la ruta según tu estructura

const app = express();

// Configuración CORS para Vercel
const FRONTEND_URLS = [
    "http://localhost:5173", // desarrollo local (Vite usa 5173)
    "http://localhost:3000",
    "https://to-do-ceja-cuevas-front.vercel.app",
    "https://to-do-ceja-cuevas-front-*.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origen
        if (!origin) return callback(null, true);
        
        if (FRONTEND_URLS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Middleware para manejar preflight OPTIONS requests
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// Middleware de conexión a MongoDB
app.use(async (req, res, next) => {
    try {
        // Verifica si connection es una función o una conexión establecida
        if (typeof connection === 'function') {
            await connection();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Rutas
app.get("/", (req, res) => res.json({ ok: true, name: "todo-pwa-api" }));
app.use("/api/tasks", taskRoutes); // Corregido: comillas dobles
app.use("/api/auth", authRoutes); // Corregido: "auto1" → "auth"

export default app;