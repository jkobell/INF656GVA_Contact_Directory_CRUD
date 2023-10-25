import express from 'express';
import { contacts_router } from './routes/api/contacts_route.js';
import { root_router } from './routes/root_route.js';

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.static('public')); //to serve static files
app.use('/', root_router);
app.use('/contacts', contacts_router);


app.listen(PORT, console.log("Server is listening on port: " + PORT))