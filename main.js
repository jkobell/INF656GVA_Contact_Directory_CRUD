import express from 'express';
import { contacts_router } from './routes/api/contacts_route.js';
import { root_router } from './routes/root_route.js';

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json()); //for parse req.body
app.use(express.static('public')); //to serve static files
app.use('/', root_router);
app.use(contacts_router);

app.listen(PORT, console.log("Server is listening on port: " + PORT))