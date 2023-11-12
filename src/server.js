import express from 'express';
import usuariosRoutes from './routes/usuario.routes.js';
import { PORT } from './config/config.js';
const app = express();

app.use(express.json());

app.use('/api', usuariosRoutes);
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint no encontrado :('
    });
});

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ', PORT);
});