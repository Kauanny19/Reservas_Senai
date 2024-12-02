document.addEventListener("DOMContentLoaded", getSalasTable);

function getSalasTable() {
  fetch("http://10.89.240.73:5000/projeto_de_reserva/sala", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const salaList = document.getElementById("salas-list-tabela");
      salaList.innerHTML = ""; //Limpa a lista antes de adicionar novos itens

      //Verifica se há usuários retornados e os adiciona à tabela
      data.sala.forEach((sala) => {
        //Cria uma nova linha
        const tr = document.createElement("tr");

        //Cria células para nome, cpf e email
        const tdNome = document.createElement("td");
        tdNome.textContent = sala.nomesala;
        tr.appendChild(tdNome);

        const tdBloco = document.createElement("td");
        tdBloco.textContent = sala.bloco;
        tr.appendChild(tdBloco);

        const tdDescricao = document.createElement("td");
        tdDescricao.textContent = sala.descricao;
        tr.appendChild(tdDescricao);

        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = sala.capacidade;
        tr.appendChild(tdCapacidade);

        //Adiciona a linha à tabela
        salaList.appendChild(tr);
      });
    })
    .catch((error) => {
      alert("Error ao obter salas:" + error.message);
      console.error("Erro:", error.message);
    });
}
