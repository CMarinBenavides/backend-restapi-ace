import express from 'express';
import usuariosRoutes from './routes/usuario.routes.js';
import solicitudesRoutes from './routes/solicitud.routes.js';
import { PORT } from './config/config.js';
const app = express();

app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', solicitudesRoutes);
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint no encontrado :('
    });
});

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ', PORT);
});