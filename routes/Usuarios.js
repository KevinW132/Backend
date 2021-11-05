const { Router } = require('express');

const router = Router();
const { getUsers,CrearUser, Login, vt,update,CrearAlimento, CrearBebida, alimepriv, bebidpriv, aceptaralime, aceptarbebid, alimento, bebida, denegaralime, denegarbebid, refaccion, desayuno, almuerzo, cena, alco, noalco, alimentopu, bebidapu, obcoali, obcobeb, CrearAlimentouser, Crearbebidauser, usuarioalim, usuariobebi, alimentodeluser, bebidadeluser, interaalimen, interabebida, exiusuaal, exiusuabe, comenalimen, likealimen, comenbebid, likebebid, likalime, likbebid, comenalim, comenbebi, puntalime, puntbebi, acpuntali, acpuntbeb, alimefavorito, bebidfavorito, updatesincon, buscpopal, buscpopalbe, buscpofilal, buscpofilbe} = require('../controllers/funciones')

//Acciones de Usuario
router.get('/users', getUsers );
router.post('/userC', CrearUser);
router.post('/login', Login, vt);
router.put('/update',update);
router.put('/updatesincon',updatesincon);

//CREACIONES E INGRESOS
router.post('/crealime', CrearAlimento);
router.post('/creabebi', CrearBebida);
router.get('/obcoali/:nombre', obcoali);
router.get('/obcobeb/:nombre', obcobeb);
router.post('/ture', CrearAlimentouser);
router.post('/tube', Crearbebidauser);

//Obtener Recetas
router.get('/alimen/:cod_alimento', alimento);
router.get('/bebida/:cod_bebida', bebida);
router.get('/alimenpu/:cod_alimento', alimentopu);
router.get('/bebidapu/:cod_bebida', bebidapu);

//Recetas Privadas
router.get('/alipri', alimepriv);
router.get('/bebipri', bebidpriv);

//Acciones de Admin
router.put('/acepalim/:cod_alimento', aceptaralime);
router.put('/acepbebi/:cod_bebida', aceptarbebid);
router.delete('/denealim/:cod_alimento', denegaralime);
router.delete('/denebebi/:cod_bebida', denegarbebid);

//Recomendacion
router.get('/refa',refaccion);
router.get('/desa',desayuno);
router.get('/almu',almuerzo);
router.get('/cena',cena);
router.get('/alco',alco);
router.get('/noalco',noalco);

//Obtener Usuario
router.get('/usuaali/:cod_alimento', usuarioalim);
router.get('/usuabeb/:cod_bebida', usuariobebi);

//Recetas del Usuario
router.get('/alideluse/:usuario', alimentodeluser);
router.get('/bebdeluse/:usuario', bebidadeluser);

//Acciones de Usuario
router.get('/exialime/:usuario/:cod_alimento', exiusuaal);
router.get('/exibebid/:usuario/:cod_bebida', exiusuabe);
router.post('/inteali', interaalimen);
router.post('/intebeb', interabebida);
router.put('/comenali', comenalimen);
router.put('/likalime', likealimen);
router.put('/comenbeb', comenbebid);
router.put('/likbebid', likebebid);

//Acciones de Receta
router.get('/likalime/:usuario/:cod_alimento', likalime);
router.get('/likbebid/:usuario/:cod_bebida', likbebid);
router.get('/comenalitodo/:cod_alimento', comenalim);
router.get('/comenbebtodo/:cod_bebida', comenbebi);
router.get('/puntalime/:cod_alimento', puntalime);
router.get('/puntbebid/:cod_bebida', puntbebi);
router.put('/acpunalim', acpuntali);
router.put('/acpunbebi', acpuntbeb);


//Acciones de Favoritos
router.get('/aliemfavori/:usuario', alimefavorito);
router.get('/bebifavor/:usuario', bebidfavorito);

//Acciones de Buscar
router.get('/buscaporpalal/:nombre', buscpopal);
router.get('/buscaporpalbe/:nombre', buscpopalbe);
router.get('/buspofilal/:valor/:nomb/:tiem/:punt/:hora/:tietie', buscpofilal);
router.get('/buspofilbe/:valor/:nomb/:tiem/:punt/:alcohol/:tietie', buscpofilbe);

module.exports = router;