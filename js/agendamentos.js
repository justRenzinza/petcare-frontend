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

        // Ordenando os pets por nome
        pets.sort((a, b) => a.name.localeCompare(b.name));

        // Limpando a lista antes de inserir novos elementos
        listaAgendamentos.innerHTML = "";

        // Mapeando os pets e criando os cards dinamicamente
        pets.map(pet => {
            // Calculando a idade com base na data de nascimento
            const birthDate = new Date(pet.birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            // Se o mês atual for menor que o mês de nascimento, ou for o mesmo mês mas o dia ainda não chegou, reduz um ano da idade
            const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

            const card = document.createElement("div");
            card.className = "card-agendamento";
            card.innerHTML = `
                <div class="info-pet">
                    <img src="src/${pet.species.toLowerCase()}.png" alt="${pet.name}" class="foto-pet">
                    <div>
                        <p class="nome-pet">${pet.name}</p>
                        <p class="tipo-pet">ANIMAL - ${pet.species}</p>
                        <p class="detalhes-pet">${finalAge} anos • ${pet.weight} kg • ${pet.breed}</p>
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
