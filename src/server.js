import 'dotenv/config';
import app from './src/app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log("🚀 Iniciando servidor...");
console.log(`🌐 Frontend permitido: https://to-do-ceja-cuevas-front.vercel.app`);
console.log(`🌐 Localhost permitido: http://localhost:5173`);

// Conectar a MongoDB si existe URI
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("✅ Conectado a MongoDB");
        startServer();
    })
    .catch(err => {
        console.error("❌ Error al conectar a MongoDB:", err.message);
        console.log("⚠️  Iniciando sin MongoDB...");
        startServer();
    });
} else {
    console.log("⚠️  Sin MONGODB_URI, iniciando sin base de datos...");
    startServer();
}

function startServer() {
    app.listen(PORT, () => {
        console.log(`✅ Servidor escuchando en puerto: ${PORT}`);
        console.log(`✅ CORS configurado para producción`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
}