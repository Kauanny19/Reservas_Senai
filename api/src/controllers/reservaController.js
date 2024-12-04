const connect = require("../db/connect"); 

module.exports = class AgendamentoController {
 
   // CREATE RESERVA  
  static createReservas(req, res) {
    //corpo da requisição
    const { fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim } =
      req.body;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!fk_id_usuario || !fk_id_sala || !datahora_inicio || !datahora_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    //verifica se o usuário existe
    const queryUsuario = `SELECT * FROM usuario WHERE id_usuario = ?`;
    const valuesUsuario = [fk_id_usuario];

    // verifica se a sala existe
    const querySala = `SELECT * FROM sala WHERE id_sala = ?`;
    const valuesSala = [fk_id_sala];

    // Verifica se já existe uma reserva no horário solicitado
    const queryHorario = `SELECT datahora_inicio, datahora_fim FROM reserva WHERE fk_id_sala = ? AND (
      (datahora_inicio < ? AND datahora_fim > ?) OR   -- verifca se o horario inicio ja tem reserva e se o horario fim tbm 
      (datahora_inicio < ? AND datahora_fim > ?) OR   
      (datahora_inicio >= ? AND datahora_inicio < ?) OR   -- verifica se o início da reserva ocorre dentro dointervalo de uma reserva já existe
      (datahora_fim > ? AND datahora_fim <= ?)  -- O novo horário termina dentro de um horário já reservado
    )`;

     // Valores usados na consulta
    const valuesHorario = [
      fk_id_sala, datahora_inicio, datahora_inicio, datahora_inicio, datahora_fim, datahora_inicio, datahora_fim, datahora_inicio, datahora_fim,    
    ];

    // Verifica se já há algum conflito de horário na sala
    connect.query(queryHorario, valuesHorario, (err, resultadosH) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao verificar horário" });
      }

      // Verifica se o usuário existe no banco
      connect.query(queryUsuario, valuesUsuario, (err, resultadosU) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao buscar usuário" });
        }

        // Verifica se a sala existe no banco
        connect.query(querySala, valuesSala, (err, resultadosS) => {
          if (err) {
            return res.status(500).json({ error: "Erro ao buscar sala" });
          }

          // Se o usuário não for encontrado retorna erro 
          if (resultadosU.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }

          // Se a sala não for encontrada retorna erro
          if (resultadosS.length === 0) {
            return res.status(404).json({ error: "Sala não encontrada" });
          }

          // Verifica se as datas são válidas
          if (
            new Date(datahora_fim).getTime() <
            new Date(datahora_inicio).getTime()
          ) {
            return res.status(400).json({ error: "Data ou Hora Inválida" });
          }

          // Verifica se a data de fim é igual à data de início
          if (
            new Date(datahora_fim).getTime() ===
            new Date(datahora_inicio).getTime()
          ) {
            return res.status(400).json({ error: "Data ou Hora Inválida" });
          }

          // Define o limite máximo de 1 hora para a reserva
          const limiteHora = 60 * 60 * 1000; // 1 hora em milissegundos
          if (new Date(datahora_fim) - new Date(datahora_inicio) > limiteHora) {
            return res
              .status(400)
              .json({ error: "O tempo de Reserva excede o limite (1h)" });
          }

          // Se já houver uma reserva no horário, retorna erro
          if (resultadosH.length > 0) {
            return res
              .status(400)
              .json({
                error: "A sala escolhida já está reservada neste horário",
              });
          }

          // Query para criar a nova reserva no banco de dados
          const queryInsert = `INSERT INTO reserva (fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim) VALUES (?, ?, ?, ?)`;
          const valuesInsert = [
            fk_id_usuario,
            fk_id_sala,
            datahora_inicio,
            datahora_fim,
          ];

          // Realiza a inserção da reserva no banco de dados
          connect.query(queryInsert, valuesInsert, (err, results) => {
            if (err) {
              return res.status(500).json({ error: "Erro ao criar reserva" });
            }

            // Retorna sucesso ao criar a reserva
            return res
              .status(201)
              .json({ message: "Sala reservada com sucesso!" });
          });
        });
      });
    });
  }

  //TODAS AS RESERVAS 
  static getAllReservas(req, res) {
    const query = `SELECT * FROM reserva`;

    connect.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro Interno do Servidor" });
      }
      
      return res
        .status(200)
        .json({ message: "Obtendo todas as reservas", reservas: results });
    });
  }

  // UPDATE
  static updateReserva(req, res) {
    const { datahora_inicio, datahora_fim } = req.body;
    const reservaId = req.params.id_reserva;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!datahora_inicio || !datahora_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Query para verificar se o novo na horário atualizaçao da reserva se ja tem
    const queryHorario = `SELECT datahora_inicio, datahora_fim FROM reserva WHERE id_reserva = ? AND (
      (datahora_inicio < ? AND datahora_fim > ?) OR   -- verifca se o horario inicio ja tem reserva e se o horario fim tbm 
      (datahora_inicio < ? AND datahora_fim > ?) OR  
      (datahora_inicio >= ? AND datahora_inicio < ?) OR   -- verifica se o início da reserva ocorre dentro dointervalo de uma reserva já existe
      (datahora_fim > ? AND datahora_fim <= ?)   -- O novo horário termina dentro de um horário já reservado
    )`;

    const valuesHorario = [
      reservaId,
      datahora_inicio,
      datahora_inicio,
      datahora_inicio,
      datahora_fim,
      datahora_inicio,
      datahora_fim,
      datahora_inicio,
      datahora_fim,
    ];

    // Query para atualizar a reserva no banco de dados
    const queryUpdate = `UPDATE reserva SET datahora_inicio = ?, datahora_fim = ? WHERE id_reserva = ?`;
    const valuesUpdate = [datahora_inicio, datahora_fim, reservaId];

    // Verifica se o novo horário da reserva sobrepõe outras
    connect.query(queryHorario, valuesHorario, (err, resultadosH) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao verificar horário" });
      }

          // Verifica se as datas são válidas
      if (new Date(datahora_fim) < new Date(datahora_inicio)) {
        return res.status(400).json({ error: "Data ou Hora Inválida" });
      }

      // Verifica se a duração da reserva excede 1 hora
      const limiteHora = 60 * 60 * 1000; // 1 hora em milissegundos
      if (new Date(datahora_fim) - new Date(datahora_inicio) > limiteHora) {
        return res
          .status(400)
          .json({ error: "O tempo de Reserva excede o limite (1h)" });
      }

      // Se tiver reserva no horario solicitado
      if (resultadosH.length > 0) {
        return res
          .status(400)
          .json({ error: "A sala escolhida já está reservada neste horário" });
      }


      connect.query(queryUpdate, valuesUpdate, (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao atualizar reserva" });
        }

        return res
          .status(201)
          .json({ message: "Reserva atualizada com sucesso!" });
      });
    });
  }

  // DELETE
  static deleteReserva(req, res) {
    const reservaId = req.params.id_reserva;
    const query = `DELETE FROM reserva WHERE id_reserva = ?`;
    const values = [reservaId];

    // Deleta a reserva com o ID fornecido
    connect.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      // Verifica se o reserva foi encontrado e excluído
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }
      return res.status(200).json({ message: "Reserva excluída com sucesso" });
    });
  }
}; 