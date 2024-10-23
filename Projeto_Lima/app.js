document.addEventListener("DOMContentLoaded", function () {
  const formularioCadastro = document.getElementById("formulario-cadastro"); // seleciona o elemento com o id indicado no <form> 'formulario-cadastro'
  const formularioLogin = document.getElementById("formulario-login");

  if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", function (event) {
      // adiciona o ouvinte do evento 'submit'
      event.preventDefault(); // previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarregue a página

      const nome = document.getElementById("nome").value; // capturar os valores dos campos do formulário pelo id
      const cpf = document.getElementById("cpf").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      // requisição http para o endpoint de cadastro de usuário
      fetch("http://localhost:5000/projeto_de_reserva/cadastro", {
        // realiza uma chamada HTTP para o servidor (a rota definida)
        method: "POST",
        headers: {
          // a requisição será em formato JSON
          "Content-Type": "application/json", // correção do formato
        },
        // transforma os dados do formulário em uma string json para serem enviados no corpo da requisição
        body: JSON.stringify({ nome, cpf, email, senha }),
      })
        .then((response) => {
          // tratamento da resposta do servidor /api
          if (response.ok) {
            // verifica se a resposta for bem sucedida (status 200)
            return response.json();
          }
          // convertendo o erro em formato json
          return response.json().then((err) => {
            // Mensagem retornada do servidor acessada pela chave "error"
            throw new Error(err.error);
          });
        }) // fechamento do then
        .then((data) => {
          // correção aqui
          // Executa a resposta de sucesso retorna ao usuario final
          // exibe um alerta com o nome do usuário que acabou de ser cadastrado
          alert("Usuário cadastrado com sucesso! ");
          // Exibe um log no terminal
          console.log("Usuário criado: ", data.user);
          //reseta os campos do formulario apos o sucesso do cadastro
          formularioCadastro.reset();
          window.location.href = "login.html";
        })
        .catch((error) => {
          // Tratamento de erro
          alert("Erro no cadastro: " + error.message);

          console.error("Erro: ", error.message);
        });
    });
  }

  if (formularioLogin) {
    //  seleciona o elemento com o id indicado no <form> 'formulario-registro'
    formularioLogin.addEventListener("submit", function (event) {
      event.preventDefault(); // previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarregue a página
      const email = document.getElementById("email").value; // capturar os valores dos campos do formulário pelo id
      const senha = document.getElementById("senha").value;

      fetch("http://localhost:5000/projeto_de_reserva/login", {
        // realiza uma chamada HTTP para o servidor (a rota definida)
        method: "POST",
        headers: {
          // a requisição será em formato JSON
          "Content-Type": "application/json",
        },
        // transforma os dados do formulário em uma string json para serem enviados no corpo da requisição
        body: JSON.stringify({ email, senha }),
      })
        .then((response) => {
          // tratamento da resposta do servidor / api
          if (response.ok) {
            // verifica se a resposta foi bem-sucedida (status: 20*)
            return response.json();
          } // --- fechamento 'response.ok'
          // convertendo o erro em formato JSON
          return response.json().then((err) => {
            // mensagem retornada do servidor, acessa pela chave 'error'
            throw new Error(err.error);
          }); // --- fechamento 'response error'
        }) // --- fechamento 'response'
        .then((data) => {
          // executa a resposta de sucesso  - retorna ao usuario final
          // exibe alerta com o nome do usuario com o nome que acabou de ser cadastrado (front)
          alert("Login bem sucedido!");
          window.location.href = "inicio.html";
        }) // --- fechamento 'data'
        //captura qualquer erro que ocorra durante o processo de requisição/ resposta
        .catch((error) => {
          // exibe alerta no (front) com erro processado
          alert("Erro no Login: " + error.message);
          console.error("Erro:", error.message);
        }); // --- fechamento 'catch(error)'
    });
  }
});
