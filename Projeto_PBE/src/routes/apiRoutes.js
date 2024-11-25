const router = require('express').Router();

const controllerCadastro = require("../controllers/controllerCadastro");
const controllerSala = require("../controllers/controllerSala")

//Rotas Cadastro
router.post('/cadastro', controllerCadastro.createUser);
router.post('/login', controllerCadastro.loginUser);
router.get('/cadastro', controllerCadastro.getAllUsers);
router.put('/cadastro', controllerCadastro.updateUser);
router.delete('/cadastro/:id', controllerCadastro.deleteUser);

router.post('/POSTSala', controllerSala.createSala);
router.get('/GETSalas', controllerSala.getAllSalas);
router.put('/PUTSala', controllerSala.updateSala);
router.delete('/DELETESala/:id', controllerSala.deleteSala);

// http://localhost:5000/projeto_de_reserva/

module.exports = router;