const connect = require("../db/connect");
module.exports = class ControllerSala {
  static async createSala(req, res) {
    const { nomesala, bloco, capacidade} = req.body;

    if (!nomesala || !bloco || !capacidade) {
      //Verifica se todos os campos estão preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else {
      const query = `INSERT INTO sala (nomesala, bloco, capacidade) VALUES('${nomesala}','${bloco}','${capacidade}')`;
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

//   static async getAllOrganizadores(req, res) {
//     const query = `SELECT * FROM organizador`;

//     try {
//       connect.query(query, function (err, results) {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Erro interno do Servidor" });
//         }

//         return res
//           .status(200)
//           .json({ message: "Lista de organizadores", organizador: results });
//       });
//     } catch (error) {
//       console.error("Erro ao executar a consulta:", error);
//       return res.status(500).json({ error: "Erro interno do servidor" });
//     }
//   }

//   static async updateOrganizador(req, res) {
//     // Desestrutura e recupera os dados enviados via corpo da requisição
//     const { id, nome, email, senha, telefone } = req.body;

//     // Validar se todos os campos foram preenchidos
//     if (!nome || !email || !senha || !telefone) {
//       return res
//         .status(400)
//         .json({ error: "Todos os campos devem ser preenchidos" });
//     }
//     const query = `UPDATE organizador SET nome=?,email=?,senha=?,telefone=? WHERE id_organizador = ?`;
//     const values = [nome, email, senha, telefone, id];

//     try{
//       connect.query(query,values,function(err,results){
//         if(err){
//           if(err.code === "ER_DUP_ENTRY"){
//             return res.status(400).json({error:"Email já cadastrado por outro organizador"});
//           }else{
//             console.error(err);
//             return res.status(500).json({error:"Erro interno do servidor"});
//           }
//         }
//         if(results.affectedRows === 0){
//           return res.status(404).json({error:"Organizador não encontrado"});
//         }
//         return res.status(200).json({message:"Organizador atualizado com sucesso"});
        

//       })
      
//   }
//     catch(error){
//       console.error("Erro ao executar consulta",error);
//       return res.status(500).json({error: "Erro interno no servidor"});

//     }

//   }
//   static async deleteOrganizador(req, res) {
//     const organizadorId = req.params.id;
//     const query = `DELETE FROM organizador WHERE id_organizador = ?`;
//     const values = [organizadorId];

//     try {
//       connect.query(query, values, function (err, results) {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Erro interno do servidor" });
//         }

//         if (results.affectedRows === 0) {
//           return res.status(404).json({ error: "Organizador não encontrado" });
//         }

//         return res
//           .status(200)
//           .json({ message: "Organizador exluido com sucesso" });
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json
//         ({error:"Erro interno do servidor"})
//     }
//   }
};
