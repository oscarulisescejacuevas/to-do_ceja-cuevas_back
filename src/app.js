import express from "express";
import morgan from "morgan";  // "morgan" no "morgan"
import cors from "cors";      // "cors" no "core"
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { connection } from "./db/connect.js";

const app = express();

// ========== CONFIGURACIÓN CORS PARA VERCEL ==========
const FRONTEND_URL = "https://to-do-ceja-cuevas-front.vercel.app";
const LOCALHOST_URL = "http://localhost:5173";

// Configurar CORS con los dominios permitidos
app.use(cors({
    origin: function (origin, callback) {
        // Lista de orígenes permitidos
        const allowedOrigins = [FRONTEND_URL, LOCALHOST_URL];
        
        // Permitir peticiones sin origen (como curl o mobile apps)
        if (!origin) return callback(null, true);
        
        // Verificar si el origen está permitido
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`Origen bloqueado: ${origin}`);
            callback(new Error("Origen no permitido por CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// IMPORTANTE: Manejar solicitudes OPTIONS (preflight)
app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Middleware de conexión a MongoDB
app.use(async (req, res, next) => {
    try {
        // Verificar conexión a MongoDB
        if (connection) {
            // Si connection es una función, ejecutarla
            if (typeof connection === 'function') {
                await connection();
            }
            // Si ya es una conexión establecida, continuar
        }
        next();
    } catch (error) {
        console.error("Error en conexión MongoDB:", error);
        next(error);
    }
});

// Ruta de prueba y health check
app.get("/", (req, res) => {
    res.json({ 
        ok: true, 
        name: "todo-pwa-api",
        frontend: FRONTEND_URL,
        cors: "enabled",
        timestamp: new Date().toISOString()
    });
});

// Health check específico
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        cors: "CONFIGURADO",
        allowedOrigins: [FRONTEND_URL, LOCALHOST_URL],
        frontend: FRONTEND_URL,
        time: new Date().toISOString()
    });
});

// Rutas de la aplicación
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// Middleware para manejar 404
app.use((req, res, next) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        path: req.path,
        method: req.method
    });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
    console.error("Error en la aplicación:", error);
    res.status(error.status || 500).json({
        error: error.message || "Error interno del servidor",
        cors: "Si ves esto, CORS está funcionando"
    });
});

export default app;