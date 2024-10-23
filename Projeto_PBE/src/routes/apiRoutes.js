const router = require('express').Router();

const controllerCadastro = require("../controllers/controllerCadastro");

//Rotas Cadastro
router.post('/cadastro', controllerCadastro.createUser);
router.post('/login', controllerCadastro.loginUser);
router.get('/cadastro', controllerCadastro.getAllUsers);
router.put('/cadastro', controllerCadastro.updateUser);
router.delete('/cadastro/:id', controllerCadastro.deleteUser);

// http://localhost:5000/projeto_de_reserva/projeto_de_reserva/

module.exports = router;