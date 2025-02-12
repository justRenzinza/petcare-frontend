document.addEventListener("DOMContentLoaded", async () => {
    const listaAgendamentos = document.getElementById("lista-agendamentos");

    // Obtendo o ID do usuário logado (supondo que está salvo no localStorage)
    const ownerId = localStorage.getItem("userId"); 

    if (!ownerId) {
        console.error("Usuário não identificado!");
        return;
    }

    try {
        // Fazendo a requisição para buscar os pets do usuário
        const response = await fetch(`/pets/owner/${ownerId}`);
        if (!response.ok) throw new Error("Erro ao buscar os pets");

        const pets = await response.json();

        // Ordenando os pets por nome (altere para outro critério, se necessário)
        pets.sort((a, b) => a.nome.localeCompare(b.nome));

        // Limpando a lista antes de inserir novos elementos
        listaAgendamentos.innerHTML = "";

        // Mapeando os pets e criando os cards dinamicamente
        pets.map(pet => {
            const card = document.createElement("div");
            card.className = "card-agendamento";
            card.innerHTML = `
                <div class="info-pet">
                    <img src="src/${pet.especie.toLowerCase()}.png" alt="${pet.nome}" class="foto-pet">
                    <div>
                        <p class="nome-pet">${pet.nome}</p>
                        <p class="tipo-pet">ANIMAL - ${pet.especie}</p>
                        <p class="detalhes-pet">${pet.idade} anos • Tipo Sanguíneo: ${pet.tipo_sangue}</p>
                    </div>
                </div>
                <span class="status pendente">Pendente</span>
            `;
            listaAgendamentos.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar os pets:", error);
    }
});