const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
const pool = new Pool({
    host: 'database-1.ckhhlfs9mey2.us-east-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'ingSWCloud21',
    database: 'FoodDiscovery',
    port: '5432'
})

const getUsers = async (req, res) => {
    const usuario = req.body.usuario
    const response = await pool.query('select * from Usuarios WHERE usuario=$1', [usuario]);
    res.send(response.rows);
}

const CrearUser = async (req, res) => {
    var pass = passwordHash.generate(req.body.pass);//crear usuario
    const { usuario, nombre, correo, rol, link } = req.body;
    const response = await pool.query('INSERT INTO usuarios (usuario, nombre, correo, pass, rol, link)  VALUES ($1,$2,$3,$4,$5,$6)', [usuario, nombre, correo, pass, rol, link], (err, result) => {
        if (err) {
            res.json({ status: 0, message: "Este Usuario ya existe", err });
        } else {
            res.json({ status: 1, message: "Usuario Creado" });
        }
    })
}

const Login = async (req, res) => {
    //passwordHash.verify(req.params.pass, rows[0].pass)//buscar usuario
    // console.log('----------------------------');
    //console.log(response.rows[0].pass);
    const { usuario, pass } = req.body;
    const response = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario])
    if (response.rows.length > 0) {
        if (passwordHash.verify(pass, response.rows[0].pass)) {
            let data = JSON.stringify(response.rows);
            let data2 = response.rows
            console.log(data2);
            const token = jwt.sign(data, 'EduardoKevin2021');
            res.json({ token, data2 });
        } else {
            res.send('0')
        }
    } else {
        res.send('0')
    }
}
//verificacion por medio de tokens
function vt(req, res, next) {
    if (!req.headers.authorization) {
        res.status(402).json('no autorizado');
    }
    const token = req.headers.authorization.substr(7);
    if (token !== '') {
        const content = jwt.verify(token, 'EduardoKevin2021');
        console.log(content);
        console.log(token);
        req.data = content;
        console.log(req.data);
        res.json(req.data);
        next();
    } else {
        res.status(401).json('token vacio')
    }
}
//update usuarios
const update = async (req, res, err) => {
    var pass = passwordHash.generate(req.body.pass);
    const { usuario, nombre, correo, link } = req.body;
    const response = await pool.query('UPDATE usuarios SET nombre=$1 , correo=$2 , pass=$3, link=$4 WHERE usuario=$5', [nombre, correo, pass, link, usuario], (err, result) => {
        if (err) {
            res.json({ status: 0, message: "No se pudo modificar", Problema: err })
        } else {
            res.json({ status: 1, message: "Perfil modificada satisfactoriamente" });
        }
    });
}
const updatesincon = async (req, res, err) => {
    const { usuario, nombre, correo, link } = req.body;
    const response = await pool.query('UPDATE usuarios SET nombre=$1 , correo=$2, link=$3 WHERE usuario=$4', [nombre, correo, link, usuario], (err, result) => {
        if (err) {
            res.json({ status: 0, message: "No se pudo modificar", Problema: err })
        } else {
            res.json({ status: 1, message: "Perfil modificada satisfactoriamente" });
        }
    });
}
//Crear Recetas
const CrearAlimento = async (req, res, err) => {
    const { nombre, pasos, ingredientes, inf_nutri, hora, tiempo, tietie, puntuacion, pri_pub, link } = req.body;
    const response = await pool.query('INSERT INTO alimentos (nombre,pasos,ingredientes,inf_nutri,hora,tiempo,tietie,puntuacion,pri_pub,link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [nombre, pasos, ingredientes, inf_nutri, hora, tiempo, tietie, puntuacion, pri_pub, link])
    res.json('1');
}
const CrearBebida = async (req, res) => {
    const { nombre, pasos, ingredientes, inf_nutri, alcohol, tiempo, tietie, puntuacion, pri_pub, link } = req.body;
    const response = await pool.query('INSERT INTO bebidas (nombre,pasos,ingredientes,inf_nutri,alcohol,tiempo,tietie,puntuacion,pri_pub,link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [nombre, pasos, ingredientes, inf_nutri, alcohol, tiempo, tietie, puntuacion, pri_pub, link])
    res.json('1');
}
const obcoali = async (req, res) => {
    var nombre = req.params.nombre;
    console.log(req.params.nombre);
    console.log('select cod_alimento from  alimentos where nombre = $1', [nombre]);
    const response = await pool.query('select cod_alimento from  alimentos where nombre = $1', [nombre]);
    res.send(response.rows);
}
const obcobeb = async (req, res) => {
    var nombre = req.params.nombre;
    const response = await pool.query('select cod_bebida from  bebidas where nombre = $1', [nombre]);
    res.send(response.rows);
}
const CrearAlimentouser = async (req, res) => {
    const { cod_alimento, usuario } = req.body;
    const response = await pool.query('INSERT INTO tus_alimentos (cod_alimento, usuario) VALUES ($1,$2)', [cod_alimento, usuario])
    res.json('1');
}
const Crearbebidauser = async (req, res) => {
    const { cod_bebida, usuario } = req.body;
    const response = await pool.query('INSERT INTO tus_bebidas (cod_bebida, usuario) VALUES ($1,$2)', [cod_bebida, usuario])
    res.json('1');
}

//Obtener Receta
const alimento = async (req, res) => {
    var cod = req.params.cod_alimento;
    const response = await pool.query('select * from  alimentos where cod_alimento = $1', [cod]);
    res.send(response.rows);
}
const bebida = async (req, res) => {
    var cod = req.params.cod_bebida;
    const response = await pool.query('select * from bebidas where cod_bebida = $1', [cod]);
    res.send(response.rows);
}
const alimentopu = async (req, res) => {
    var cod = req.params.cod_alimento;
    const response = await pool.query(`select * from  alimentos where cod_alimento = $1 and pri_pub = 'pub'`, [cod]);
    res.send(response.rows);
}
const bebidapu = async (req, res) => {
    var cod = req.params.cod_bebida;
    const response = await pool.query(`select * from bebidas where cod_bebida = $1 and pri_pub = 'pub'`, [cod]);
    res.send(response.rows);
}

//Recetas Privadas
const alimepriv = async (req, res) => {
    const response = await pool.query(`select * from  alimentos where pri_pub = 'priv'`);
    res.send(response.rows);
}
const bebidpriv = async (req, res) => {
    const response = await pool.query(`select * from  bebidas where pri_pub = 'priv'`);
    res.send(response.rows);
}

//Acciones de Admin
const aceptaralime = async (req, res) => {
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`update alimentos set pri_pub = 'pub' where cod_alimento = $1`, [cod_alimento]);
    res.json('Receta Aceptada')
}
const aceptarbebid = async (req, res) => {
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`update bebidas set pri_pub = 'pub'  where cod_bebida = $1`, [cod_bebida]);
    res.json('Receta Aceptada')
}
const denegaralime = async (req, res) => {
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`delete from tus_alimentos where cod_alimento = $1`, [cod_alimento]);
    const response2 = await pool.query(`delete from alimentos where cod_alimento = $1`, [cod_alimento]);
    res.json('Receta Denegada')
}
const denegarbebid = async (req, res) => {
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`delete from bebidas where cod_bebida = $1`, [cod_bebida]);
    res.json('Receta Denegada')
}
//Recomendaciones
const refaccion = async (req, res) => {
    const response = await pool.query(`select * from  alimentos where hora = 'refaccion' and pri_pub = 'pub'`);
    res.send(response.rows);
}
const desayuno = async (req, res) => {
    const response = await pool.query(`select * from  alimentos where hora = 'desayuno' and pri_pub = 'pub'`);
    res.send(response.rows);
}
const almuerzo = async (req, res) => {
    const response = await pool.query(`select * from  alimentos where hora = 'almuerzo' and pri_pub = 'pub'`);
    res.send(response.rows);
}
const cena = async (req, res) => {
    const response = await pool.query(`select * from  alimentos where hora = 'cena' and pri_pub = 'pub'`);
    res.send(response.rows);
}
const alco = async (req, res) => {
    const response = await pool.query(`select * from  bebidas where alcohol = 'alcoholico' and pri_pub = 'pub'`);
    res.send(response.rows);
}
const noalco = async (req, res) => {
    const response = await pool.query(`select * from  bebidas where alcohol = 'noalcoholico' and pri_pub = 'pub'`);
    res.send(response.rows);
}
//obtener Usuario
const usuarioalim = async (req, res) => {
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`select usuario from tus_alimentos where cod_alimento = $1`, [cod_alimento]);
    res.send(response.rows);
}
const usuariobebi = async (req, res) => {
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`select usuario from tus_bebidas where cod_bebida = $1`, [cod_bebida]);
    res.send(response.rows);
}

//Recetas de Usuario
const alimentodeluser = async (req, res) => {
    var usuario = req.params.usuario;
    console.log(usuario);
    const response = await pool.query('select cod_alimento from tus_alimentos where usuario = $1', [usuario]);
    res.send(response.rows);
}
const bebidadeluser = async (req, res) => {
    var usuario = req.params.usuario;
    const response = await pool.query('select cod_bebida from tus_bebidas where usuario = $1', [usuario]);
    res.send(response.rows);
}
//Acciones de Usuario
const interaalimen = async (req, res) => {
    const { lik, comentario, puntuacion, cod_alimento, usuario } = req.body;
    const response = await pool.query('INSERT INTO int_alimento (lik, comentario, puntuacion, cod_alimento, usuario) VALUES ($1,$2,$3,$4,$5)', [lik, comentario, puntuacion, cod_alimento, usuario])
    res.json('1');
}
const interabebida = async (req, res) => {
    const { lik, comentario, puntuacion, cod_bebida, usuario } = req.body;
    const response = await pool.query('INSERT INTO int_bebida (lik, comentario, puntuacion, cod_bebida, usuario) VALUES ($1,$2,$3,$4,$5)', [lik, comentario, puntuacion, cod_bebida, usuario])
    res.json('1');
}
const exiusuaal = async (req, res) => {
    var usuario = req.params.usuario;
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`select usuario from int_alimento where cod_alimento = $1 and usuario = $2`, [cod_alimento, usuario]);
    res.send(response.rows);
}
const exiusuabe = async (req, res) => {
    var usuario = req.params.usuario;
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`select usuario from int_bebida where cod_bebida = $1 and usuario = $2`, [cod_bebida, usuario]);
    res.send(response.rows);
}
const comenalimen = async (req, res) => {
    const { comentario, puntuacion, cod_alimento, usuario } = req.body;
    const response = await pool.query(`update int_alimento set (comentario, puntuacion) = ($1,$2) where cod_alimento = $3 and usuario = $4`, [comentario, puntuacion, cod_alimento, usuario]);
    res.json('1');
}
const likealimen = async (req, res) => {
    const { lik, cod_alimento, usuario } = req.body;
    console.log(req.body);
    const response = await pool.query(`update int_alimento set lik = $1 where cod_alimento = $2 and usuario = $3`, [lik, cod_alimento, usuario]);
    res.json('1');
}
const comenbebid = async (req, res) => {
    const { comentario, puntuacion, cod_bebida, usuario } = req.body;
    const response = await pool.query(`update int_bebida set (comentario, puntuacion) = ($1,$2) where cod_bebida = $3 and usuario = $4`, [comentario, puntuacion, cod_bebida, usuario]);
    res.json('1');
}
const likebebid = async (req, res) => {
    const { lik, cod_bebida, usuario } = req.body;
    const response = await pool.query(`update int_bebida set lik = $1 where cod_bebida = $2 and usuario = $3`, [lik, cod_bebida, usuario]);
    res.json('1');
}

//Accionesd de receta
const likalime = async (req, res) => {
    var usuario = req.params.usuario;
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`select lik from int_alimento where cod_alimento = $1 and usuario = $2`, [cod_alimento, usuario]);
    res.send(response.rows);
}
const likbebid = async (req, res) => {
    var usuario = req.params.usuario;
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`select lik from int_bebida where cod_bebida = $1 and usuario = $2`, [cod_bebida, usuario]);
    res.send(response.rows);
}
const comenalim = async (req, res) => {
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`select usuario,comentario from int_alimento where cod_alimento = $1`, [cod_alimento]);
    res.send(response.rows);
}
const comenbebi = async (req, res) => {
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`select usuario,comentario from int_bebida where cod_bebida = $1`, [cod_bebida]);
    res.send(response.rows);
}
const puntalime = async (req, res) => {
    var cod_alimento = req.params.cod_alimento;
    const response = await pool.query(`select puntuacion from int_alimento where cod_alimento = $1`, [cod_alimento]);
    res.send(response.rows);
}
const puntbebi = async (req, res) => {
    var cod_bebida = req.params.cod_bebida;
    const response = await pool.query(`select puntuacion from int_bebida where cod_bebida = $1`, [cod_bebida]);
    res.send(response.rows);
}
const acpuntali = async (req, res) => {
    const { puntuacion, cod_alimento } = req.body;
    const response = await pool.query(`update alimentos set puntuacion = $1 where cod_alimento = $2`, [puntuacion, cod_alimento]);
    res.json('1');
}
const acpuntbeb = async (req, res) => {
    const { puntuacion, cod_bebida } = req.body;
    const response = await pool.query(`update bebidas set puntuacion = $1  where cod_bebida = $2`, [puntuacion, cod_bebida]);
    res.json('1');
}

//Acciones de favoritos

const alimefavorito = async (req, res) => {
    var usuario = req.params.usuario;
    const response = await pool.query(`select cod_alimento from int_alimento where usuario = $1 and lik = '1'`, [usuario]);
    res.send(response.rows);
}
const bebidfavorito = async (req, res) => {
    var usuario = req.params.usuario;
    const response = await pool.query(`select cod_bebida from int_bebida where usuario = $1 and lik = '1'`, [usuario]);
    res.send(response.rows);
}

//Acciones de Busacar
const buscpopal = async (req, res) => {
    var nombre = req.params.nombre;
    const response = await pool.query("select * from alimentos where nombre like '%" + nombre + "%'");
    res.send(response.rows);
}
const buscpopalbe = async (req, res) => {
    var nombre = req.params.nombre;
    const response = await pool.query("select * from bebidas where nombre like '%" + nombre + "%'");
    res.send(response.rows);
}
const buscpofilal = async (req, res) => {
    const nomb = req.params.nomb;
    const tiem = req.params.tiem;
    const punt = req.params.punt;
    const hora  = req.params.hora;
    const tietie = req.params.tietie;
    var valor = Number(req.params.valor);
    switch (valor) {
        case 0:
            const response0 = await pool.query(`select * from  alimentos where pri_pub = 'pub'`);
            res.send(response0.rows);
            break;
        case 1:
            const response = await pool.query(`select * from alimentos where tiempo = $1 and tietie = $2`, [tiem,tietie]);
            res.send(response.rows);
            break;
        case 2:
            const response2 = await pool.query(`select * from alimentos where puntuacion= $1`, [punt]);
            res.send(response2.rows);
            break;
        case 3:
            const response3 = await pool.query(`select * from alimentos where puntuacion= $1 and tiempo = $2 and tietie = $3`, [punt,tiem,tietie]);
            res.send(response3.rows);
            break;
        case 4:
            const response4 = await pool.query(`select * from alimentos where hora= $1`, [hora]);
            res.send(response4.rows);
            break;
        case 5:
            const response5 = await pool.query(`select * from alimentos where hora= $1 and tiempo = $2 and tietie = $3`, [hora,tiem,tietie]);
            res.send(response5.rows);
            break;
        case 6:
            const response6 = await pool.query(`select * from alimentos where hora= $1 and puntuacion= $2`, [hora,punt]);
            res.send(response6.rows);
            break;
        case 7:
            const response7 = await pool.query(`select * from alimentos where hora= $1 and puntuacion= $2 and tiempo = $3 and tietie = $4`, [hora,punt,tiem,tietie]);
            res.send(response7.rows);
            break;
        case 8:
            const response8 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%'");
            res.send(response8.rows);
            break;
        case 9:
            const response9 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and tiempo="+ tiem +" and tietie='"+ tietie+"'");
            res.send(response9.rows);
            break;
        case 10:
            const response10 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and puntuacion="+ punt);
            res.send(response10.rows);
            break;
        case 11:
            const response11 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and puntuacion="+ punt+ " and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response11.rows);
            break;
        case 12:
            const response12 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and hora='"+ hora+"'");
            res.send(response12.rows);
            break;
        case 13:
            const response13 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and hora='"+ hora+ "' and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response13.rows);
            break;
        case 14:
            const response14 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and hora='"+ hora+ "' and puntuacion="+ punt);
            res.send(response14.rows);
            break;
        case 15:
            const response15 = await pool.query("select * from alimentos where nombre like '%" + nomb + "%' and hora='"+ hora+ "' and puntuacion="+ punt+ " and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response15.rows);
            break;
        default:
            res.json('error');
            break;
    }
}
const buscpofilbe = async (req, res) => {
    const nomb = req.params.nomb;
    const tiem = req.params.tiem;
    const punt = req.params.punt;
    const alcohol  = req.params.alcohol;
    const tietie = req.params.tietie;
    var valor = Number(req.params.valor);
    switch (valor) {
        case 0:
            const response0 = await pool.query(`select * from  bebidas where pri_pub = 'pub'`);
            res.send(response0.rows);
            break;
        case 1:
            const response = await pool.query(`select * from bebidas where tiempo = $1 and tietie = $2`, [tiem,tietie]);
            res.send(response.rows);
            break;
        case 2:
            const response2 = await pool.query(`select * from bebidas where puntuacion= $1`, [punt]);
            res.send(response2.rows);
            break;
        case 3:
            const response3 = await pool.query(`select * from bebidas where puntuacion= $1 and tiempo = $2 and tietie = $3`, [punt,tiem,tietie]);
            res.send(response3.rows);
            break;
        case 4:
            const response4 = await pool.query(`select * from bebidas where alcohol= $1`, [alcohol]);
            res.send(response4.rows);
            break;
        case 5:
            const response5 = await pool.query(`select * from bebidas where alcohol= $1 and tiempo = $2 and tietie = $3`, [alcohol,tiem,tietie]);
            res.send(response5.rows);
            break;
        case 6:
            const response6 = await pool.query(`select * from bebidas where alcohol= $1 and puntuacion= $2`, [alcohol,punt]);
            res.send(response6.rows);
            break;
        case 7:
            const response7 = await pool.query(`select * from bebidas where alcohol= $1 and puntuacion= $2 and tiempo = $3 and tietie = $4`, [alcohol,punt,tiem,tietie]);
            res.send(response7.rows);
            break;
        case 8:
            const response8 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%'");
            res.send(response8.rows);
            break;
        case 9:
            const response9 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and tiempo="+ tiem +" and tietie='"+ tietie+"'");
            res.send(response9.rows);
            break;
        case 10:
            const response10 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and puntuacion="+ punt);
            res.send(response10.rows);
            break;
        case 11:
            const response11 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and puntuacion="+ punt+ " and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response11.rows);
            break;
        case 12:
            const response12 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and alcohol='"+ alcohol+"'");
            res.send(response12.rows);
            break;
        case 13:
            const response13 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and alcohol='"+ alcohol+ "' and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response13.rows);
            break;
        case 14:
            const response14 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and alcohol='"+ alcohol+ "' and puntuacion="+ punt);
            res.send(response14.rows);
            break;
        case 15:
            const response15 = await pool.query("select * from bebidas where nombre like '%" + nomb + "%' and alcohol='"+ alcohol+ "' and puntuacion="+ punt+ " and tiempo="+ tiem +"and tietie='"+ tietie+"'");
            res.send(response15.rows);
            break;
        default:
            res.json('error');
            break;
    }
}
module.exports = {
    getUsers, //obtiene los usuarios
    CrearUser,//solo crea usuarios
    Login, // para ingresar
    vt, //verificar token
    update,
    //Obtener Receta
    alimento,
    bebida,
    alimentopu,
    bebidapu,
    //CREACIONES E INGRESOS
    CrearAlimento,
    CrearBebida,
    obcoali,
    obcobeb,
    CrearAlimentouser,
    Crearbebidauser,
    //RECETAS PRIVADAS
    alimepriv,
    bebidpriv,
    //Acciones de Admin
    aceptaralime,
    aceptarbebid,
    denegaralime,
    denegarbebid,
    //recomendaciones
    desayuno,
    almuerzo,
    cena,
    refaccion,
    alco,
    noalco,
    //Obtener Usuario
    usuarioalim,
    usuariobebi,
    //Recetas de Usuario
    alimentodeluser,
    bebidadeluser,
    //Acciones de Usuario
    interaalimen,
    interabebida,
    exiusuaal,
    exiusuabe,
    comenalimen,
    likealimen,
    comenbebid,
    likebebid,
    //Acciones de Receta
    likalime,
    likbebid,
    comenalim,
    comenbebi,
    puntalime,
    puntbebi,
    acpuntali,
    acpuntbeb,
    alimefavorito,
    bebidfavorito,
    updatesincon,
    //Acciones de buscar
    buscpopal,
    buscpopalbe,
    buscpofilal,
    buscpofilbe
}