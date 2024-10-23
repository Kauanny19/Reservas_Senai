const connect = require("../db/connect");

module.exports = class controllerCadastro {
  static async createUser(req, res) {
    const { cpf, email, senha, nome } = req.body;

    if (!cpf || !email || !senha || !nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      const querycpf = `SELECT * FROM usuario WHERE cpf = '${cpf}'`;

      try {
        connect.query(querycpf, function (err, results) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error interno do servidor" });
          } else if (results.length > 0) {
            return res.status(400).json({ error: "CPF já cadastrado" });
          } else {
            const query = `INSERT INTO usuario (cpf, senha, email, nome) VALUES('${cpf}',
            '${senha}',
            '${email}',
            '${nome}')`;

            connect.query(query, function (err) {
              if (err) {
                console.error(err);
                console.error(err.code);
                if (err.code === "ER_DUP_ENTRY") {
                  return res
                    .status(400)
                    .json({
                      error: "O email já está vinculado a outro usuário",
                    });
                } else {
                  return res
                    .status(500)
                    .json({ error: "Error interno do servidor" });
                }
              } else {
                return res
                  .status(201)
                  .json({ message: "Usuário criado com sucesso" });
              }
            });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }

  static async loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      const query = `SELECT * FROM usuario WHERE email = '${email}'`;

      try {
        //Executando a query
        connect.query(query, function (err, results) {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro interno do Servidor" });
          }
          if (results.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }

          const usuario = results[0];

          //Verifica senha
          if (usuario.senha === senha) {
            return res
              .status(200)
              .json({ message: "Login realiazado com sucesso!" });
          } else {
            return res.status(401).json({ error: "Senha incorreta" });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro Interno do Servidor" });
      }
    }
  }

  static async updateUser(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, email, senha, nome } = req.body;

    // Validar se todos os campos foram preenchidos
    if (!cpf || !email || !senha || !nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET nome=?,email=?,senha=? WHERE cpf = ?`;
    const values = [nome, email, senha, cpf];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          } else {
            console.error(err);
            res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Error interno do servidor" });
    }
  }

  static async deleteUser(req, res) {
    const id_usuario = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [id_usuario];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário excluído com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
