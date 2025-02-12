const urlBackend = 'URL_DO_BACKEND';

document.getElementById("formCadastroPet").addEventListener("submit", async function(event) {
    event.preventDefault();

    const ownerId = localStorage.getItem("userId"); // Pegando o ID do usuário logado
    if (!ownerId) {
        alert("Usuário não identificado!");
        return;
    }

    const pet = {
        name: document.querySelector(".nomepet").value.trim(),
        species: document.querySelector(".tipo").value.trim(),
        breed: document.querySelector(".raca").value.trim(),
        weight: document.querySelector(".peso").value ? parseFloat(document.querySelector(".peso").value) : 0,
        birthDate: document.getElementById("datapet").value.trim(),
        ownerId: parseInt(ownerId) // buscando owner id na local storage
    };

    try {
        const response = await fetch(`${urlBackend}/pets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pet)
        });

        if (response.ok) {
            alert("Pet cadastrado com sucesso!");

            
            document.getElementById("formCadastroPet").reset(); // limpando os campos
        } else {
            alert("Erro ao cadastrar o pet!");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor!");
    }
});
