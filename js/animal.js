document.addEventListener("DOMContentLoaded", async () => {
    const listaAnimais = document.querySelector(".animal-list");
    
    const urlBackend = 'http://localhost:3001';
    const ownerId = localStorage.getItem("id"); // Pegando o ID do usuário logado

    if (!ownerId) {
        console.error("Usuário não identificado!");
        listaAnimais.innerHTML = "<p>Erro: Usuário não identificado.</p>";
        return;
    }

    console.log("Owner ID:", ownerId);

    try {
        const response = await fetch(`${urlBackend}/pets/owner/${ownerId}`);
        if (!response.ok) throw new Error(`Erro ao buscar os pets: ${response.statusText}`);
        
        const pets = await response.json();
        
        if (pets.length === 0) {
            listaAnimais.innerHTML += "<p>Você ainda não cadastrou nenhum animal.</p>";
            return;
        }
        
        pets.forEach(pet => {
            const birthDate = new Date(pet.birthDate).toLocaleDateString("pt-BR");
            
            const card = document.createElement("div");
            card.className = "animal-card";
            card.innerHTML = `
                <div class="animal-info">
                    <p><strong>Nome:</strong> ${pet.name}</p>
                    <p><strong>Tipo:</strong> ${pet.species}</p>
                    <p><strong>Raça:</strong> ${pet.breed}</p>
                    <p><strong>Data de Nascimento:</strong> ${birthDate}</p>
                </div>
            `;
            listaAnimais.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar os pets:", error);
        listaAnimais.innerHTML = "<p>Erro ao carregar os pets. Tente novamente mais tarde.</p>";
    }
});
