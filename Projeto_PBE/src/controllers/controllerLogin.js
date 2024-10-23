const connect = require("../db/connect");

module.exports = class controllerLogin {
  static async loginUsuario(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
        const query = `SELECT * FROM usuario WHERE email = '${email}'`;

        try{
            //Executando a query
            connect.query(query, function (err, results){
              if(err){
                console.log(err);
                return res.status(500).json({error: "Erro interno do Servidor"});
              }
              if(results.length === 0){
                return res.status(404).json({error: "Usuário não encontrado"});
              }

              const usuario = results[0];

              //Verifica senha
              if(usuario.senha === senha){
                return res.status(200).json({message: "Login realiazado com sucesso!"});
              } else{
                return res.status(401).json({error: "Senha incorreta"});
              }
            });
        }catch(error){
          console.error(error);
          return res.status(500).json({error: "Erro Interno do Servidor"})
        }
    }
  }
};