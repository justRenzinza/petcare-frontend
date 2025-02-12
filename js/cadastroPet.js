const urlBackend = 'URL_DO_BACKEND'; 

document.getElementById("formCadastroPet").addEventListener("submit", async function(event) {
    event.preventDefault();

    const pet = {
        name: document.querySelector(".nomepet").value,
        species: document.querySelector(".tipo").value,
        breed: document.querySelector(".raca").value,
        weight: document.querySelector(".peso").value ? parseFloat(document.querySelector(".peso").value) : null,
        birthDate: document.getElementById("datapet").value,
        ownerId: parseInt(document.querySelector(".idproprietario").value)
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
            const data = await response.json();
            alert("Pet cadastrado com sucesso!");
            console.log(data); // tratamento de erro de preguiçoso
        } else {
            alert("Erro ao cadastrar o pet!");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor!");
    }
});