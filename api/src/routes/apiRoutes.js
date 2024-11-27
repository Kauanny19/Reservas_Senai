const router = require('express').Router();

const controllerCadastro = require("../controllers/controllerCadastro");
const controllerSala = require("../controllers/controllerSala");
const reservaController = require('../controllers/reservaController');

//Rotas Cadastro
router.post('/cadastro', controllerCadastro.createUser);
router.get('/cadastro', controllerCadastro.getAllUsers);
router.put('/cadastro', controllerCadastro.updateUser);
router.delete('/cadastro/:id', controllerCadastro.deleteUser);
router.post('/login', controllerCadastro.loginUser);

router.post('/sala', controllerSala.createSala);
router.get('/sala', controllerSala.getAllSalas);
router.put('/sala', controllerSala.updateSala);
router.delete('/sala/:id', controllerSala.deleteSala);

router.get("/reserva", reservaController.createReservas); 
router.post("/reserva", reservaController.createReservas); 
router.get("/reservas", reservaController.getAllReservas); 
router.put("/reserva/:id_reserva", reservaController.updateReserva); 
router.delete("/reserva/:id_reserva", reservaController.deleteReserva);

// http://10.89.240.78:5000/projeto_de_reserva/

module.exports = router;