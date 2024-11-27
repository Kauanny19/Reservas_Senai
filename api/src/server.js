const app = require("./index"); //Importar a instacia do Express configurada em index.js
const cors = require("cors");

const corsOpitions = {
    origin: '*', //Substitua pela origem permitida
    methods: 'GET,HEAD,PUT,PATH.POST,DELETE', //Métodos HTTP permitidos
    credentials: true, //Permite o uso de cookies e credenciais
    optionsSuccessStatus: 204, //Define o status de resposta para o método OPTIONS
};

//Aplicando o middleware CORS no app
app.use(cors(corsOpitions));
app.listen(5000); 


// http://10.89.240.78:5000/projeto_de_reserva/