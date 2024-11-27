const connect = require("../db/connect");
module.exports = class ControllerSala {
  static async createSala(req, res) {
    const { nomesala, bloco, capacidade, descricao} = req.body;

    if (!nomesala || !bloco || !capacidade) {
      //Verifica se todos os campos estão preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else {
      const query = `INSERT INTO sala (nomesala, bloco, capacidade, descricao) VALUES('${nomesala}','${bloco}','${capacidade}','${descricao}')`;
      try {
        connect.query(query, function (err) {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                error: "A sala já está cadastrada",
              });
            } else {
              return res.status(400).json({
                error: "Erro interno do servidor",
              });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Sala criada com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }

  static async getAllSalas(req, res) {
    const query = `SELECT * FROM sala`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }

        return res
          .status(200)
          .json({ message: "Lista de salas", sala: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateSala(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { id_sala, nomesala, bloco, capacidade, descricao} = req.body;

    // Validar se todos os campos foram preenchidos
    if (!nomesala || !bloco || !capacidade ||!descricao ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE sala SET nomesala=?,bloco=?,capacidade=?,descricao=? WHERE id_sala = ?`;
    const values = [nomesala, bloco, capacidade, descricao, id_sala];

    try{
      connect.query(query,values,function(err,results){
        if(err){
          if(err.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error:"Sala já cadastrada"});
          }else{
            console.error(err);
            return res.status(500).json({error:"Erro interno do servidor"});
          }
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error:"Sala não encontrada"});
        }
        return res.status(200).json({message:"Sala atualizada com sucesso"});
        

      })
      
  }
    catch(error){
      console.error("Erro ao executar consulta",error);
      return res.status(500).json({error: "Erro interno no servidor"});

    }
  }

  static async deleteSala(req, res) {
    const salaId = req.params.id;
    const query = `DELETE FROM sala WHERE id_sala = ?`;
    const values = [salaId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        return res
          .status(200)
          .json({ message: "Sala exluida com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json
        ({error:"Erro interno do servidor"})
    }
  }
};
