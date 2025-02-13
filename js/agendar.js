document.addEventListener("DOMContentLoaded", async () => {
    const selectPet = document.getElementById("selectPet");
    const selectClinica = document.getElementById("selectClinica");
    const botaoAgendar = document.querySelector(".botao-agendar");
    const urlBackend = 'http://54.174.116.135:3001';
    const ownerId = localStorage.getItem("id"); // Pegando o ID do usuário logado

    // Extrair o clinicId da URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedClinicId = urlParams.get('clinicId'); // Supondo que o parâmetro seja 'clinicId'

    if (!ownerId) {
        console.error("Usuário não identificado!");
        return;
    }

    try {
        // Requisição para buscar os pets do dono
        const response = await fetch(`${urlBackend}/pets/owner/${ownerId}`);
        if (!response.ok) throw new Error(`Erro ao buscar os pets: ${response.statusText}`);

        const pets = await response.json();

        if (pets.length === 0) {
            alert("Você não tem nenhum pet cadastrado.");
            return;
        }

        // Preencher o select de pets
        pets.forEach(pet => {
            const option = document.createElement("option");
            option.value = pet.id;
            option.textContent = pet.name;
            selectPet.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar os pets:", error);
    }

    try {
        // Requisição para buscar as clínicas
        const response = await fetch(`${urlBackend}/clinic`);
        if (!response.ok) throw new Error(`Erro ao buscar as clínicas: ${response.statusText}`);

        const clinicas = await response.json();

        if (!Array.isArray(clinicas.items)) {
            console.error("Formato de resposta inesperado para clínicas:", clinicas);
            return;
        }

        // Preencher o select de clínicas e marcar a clínica selecionada
        clinicas.items.forEach(clinica => {
            const option = document.createElement("option");
            option.value = clinica.id;
            option.textContent = clinica.name;

            // Verificar se o ID da clínica na URL é igual ao ID da clínica no loop
            const selected = selectedClinicId === clinica.id.toString(); // Comparação como string

            // Marcar a clínica como selecionada, se for a que foi extraída da URL
            if (selected) {
                option.selected = true;
            }

            selectClinica.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar as clínicas:", error);
    }

    // Adicionar eventos de clique nos horários
    function adicionarEventosHorarios() {
        const botoesHorarios = document.querySelectorAll('.botao-horario');
        botoesHorarios.forEach(botao => {
            botao.addEventListener('click', () => {
                // Remover a classe "selecionado" de todos os horários
                botoesHorarios.forEach(b => b.classList.remove('selecionado'));
                // Adicionar a classe "selecionado" ao horário clicado
                botao.classList.add('selecionado');
            });
        });
    }

    // Adicionar os eventos de clique nos horários
    adicionarEventosHorarios();

    // Agendar consulta
    botaoAgendar.addEventListener("click", () => {
        const petSelecionado = selectPet.value;
        const clinicaSelecionada = selectClinica.value;
        const dataSelecionada = document.getElementById("dataAgendamento").value; // Pega o valor do input de data
        const horarioSelecionado = document.querySelector(".botao-horario.selecionado");

        if (!petSelecionado || !dataSelecionada || !horarioSelecionado) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Montar a data e hora no formato necessário (Exemplo: 2025-02-13T09:00:00)
        const dataHoraAgendamento = new Date(`${dataSelecionada}T${horarioSelecionado.textContent}:00`);

        // Estrutura do objeto de agendamento conforme o backend espera
        const dataAgendamento = {
            date: dataHoraAgendamento,  // Data e hora do agendamento
            status: 'Agendado',         // Status do agendamento (pode ser "Agendado", "Confirmado", "Pendente", "Cancelado")
            clinicId: parseInt(clinicaSelecionada), // Identificação da clínica
            petId: parseInt(petSelecionado) // ID do pet
        };

        console.log('Dados a serem enviados:', dataAgendamento);

        // Enviar os dados para o backend
        fetch(`${urlBackend}/appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataAgendamento)
        })
        .then(response => response.json())
        .then(data => {
            alert(`Consulta agendada para o pet: ${petSelecionado}`);
            window.location.href = '/agendamentos.html'; // Redirecionando para a página inicial
        })
        .catch(error => {
            console.error('Erro ao agendar:', error);
        });
    });
});