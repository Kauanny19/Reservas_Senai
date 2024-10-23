const router = require('express').Router();

const controllerCadastro = require("../controllers/controllerCadastro");
const controllerLogin = require("../controllers/controllerLogin");

//Rotas Cadastro
router.post('/cadastro', controllerCadastro.createUser);
router.get('/cadastro', controllerCadastro.getAllUsers);
router.put('/cadastro', controllerCadastro.updateUser);
router.delete('/cadastro/:id', controllerCadastro.deleteUser);

//Rotas Login
router.post('/login', controllerLogin.loginUsuario);




module.exports = router;