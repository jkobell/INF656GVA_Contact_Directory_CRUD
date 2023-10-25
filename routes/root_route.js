import express from 'express';
const root_router = express();
import path, { resolve } from 'path';
export { root_router };


root_router.get("^/$|/index(.html)?", (req, res) => {
    let root = path.dirname('main.js');     
    res.sendFile("./views/index.html", { root: root });    
  });