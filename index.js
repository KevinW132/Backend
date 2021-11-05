const express = require('express');
const app = express();
const cors=require('cors');

// json y xml,,,, middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());
//rutas

app.use(require('./routes/Usuarios'))


app.listen(3000);
console.log('Server en puerto 3000');