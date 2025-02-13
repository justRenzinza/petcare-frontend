document.addEventListener("DOMContentLoaded", async () => {
    const listaAgendamentos = document.getElementById("lista-agendamentos");
    const urlBackend = 'http://54.174.116.135:3001';


    const ownerId = localStorage.getItem("id"); // Pegando o ID do usuário logado

    if (!ownerId) {
        console.error("Usuário não identificado!");
        return;
    }

    try {
        // Fazendo a requisição para buscar os agendamentos do dono
        const response = await fetch(`${urlBackend}/appointment/pet-owner/${ownerId}`);
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const agendamentos = await response.json();
        console.log(agendamentos);  // Adicionando o log para inspecionar a resposta

        // Verificando se existem agendamentos
        if (agendamentos.length === 0) {
            listaAgendamentos.innerHTML = `
                <div class="erro-mensagem">
                    <p>Você não tem agendamentos.</p>
                </div>
            `;
            return;
        }

        // Ordenando os agendamentos por data
        agendamentos.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Adicionando os cards abaixo do botão de Novo Agendamento
        for (const agendamento of agendamentos) {
            console.log(agendamento); // Verificar a estrutura de cada agendamento

            // Fazendo uma requisição para buscar os dados do pet
            const petResponse = await fetch(`${urlBackend}/pets/${agendamento.petId}`);
            if (!petResponse.ok) {
                console.error(`Erro ao buscar dados do pet com ID ${agendamento.petId}`);
                continue; // Pula para o próximo agendamento se falhar
            }

            const pet = await petResponse.json();
            if (!pet) {
                console.error("Dados do pet não encontrados para o agendamento", agendamento);
                continue; // Pula para o próximo agendamento se falhar
            }

            // Fazendo a requisição para buscar o nome da clínica
            const clinicResponse = await fetch(`${urlBackend}/clinic/${agendamento.clinicId}`);
            let clinicName = "Não informado";
            if (clinicResponse.ok) {
                const clinic = await clinicResponse.json();
                clinicName = clinic.name || "Não informado";
            }

            // Calculando a idade com base na data de nascimento
            const birthDate = new Date(pet.birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

            // Criando o card de agendamento
            const card = document.createElement("div");
            card.className = "card-agendamento";

            const infoPet = document.createElement("div");
            infoPet.className = "info-pet";

            const dadosPet = document.createElement("div");
            dadosPet.className = "dados-pet";

            const nomePet = document.createElement("p");
            nomePet.className = "nome-pet";
            nomePet.textContent = pet.name;

            const tipoPet = document.createElement("p");
            tipoPet.className = "tipo-pet";
            tipoPet.textContent = pet.species;

            dadosPet.appendChild(nomePet);
            dadosPet.appendChild(tipoPet);

            infoPet.appendChild(dadosPet);

            const infoConsulta = document.createElement("div");
            infoConsulta.className = "info-consulta";

            // Formatar data e hora para exibição
            const dataAgendamento = new Date(agendamento.date);
            const dataFormatada = dataAgendamento.toLocaleDateString('pt-BR');
            const horarioFormatado = dataAgendamento.toLocaleTimeString('pt-BR');

            const data = document.createElement("p");
            data.innerHTML = `<span>DATA</span> - ${dataFormatada}`;

            const horario = document.createElement("p");
            horario.innerHTML = `<span>HORÁRIO</span> - ${horarioFormatado}`;

            const local = document.createElement("p");
            local.innerHTML = `<span>LOCAL</span> - ${clinicName}`;

            infoConsulta.appendChild(data);
            infoConsulta.appendChild(horario);
            infoConsulta.appendChild(local);

            const status = document.createElement("span");
            status.className = `status ${agendamento.status.toLowerCase()}`;
            status.textContent = agendamento.status;

            card.appendChild(infoPet);
            card.appendChild(infoConsulta);
            card.appendChild(status);

            // Adicionando o card ao elemento de lista de agendamentos, logo após o botão
            listaAgendamentos.appendChild(card);
        }

    } catch (error) {
        console.error("Erro ao carregar os agendamentos:", error);
    }
});
