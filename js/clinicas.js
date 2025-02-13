const urlBackend = 'http://54.174.116.135:3001/clinic'; // URL da API

async function carregarClinicas() {
    try {
        const response = await fetch(urlBackend, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        exibirClinicas(data.items);
    } catch (error) {
        console.error('Erro ao carregar clínicas:', error);
        alert('Erro ao carregar clínicas. Tente novamente.');
    }
}

function exibirClinicas(clinicas) {
    const container = document.getElementById('clinics-container');

    clinicas.forEach(clinica => {
        const clinicCard = document.createElement('div');
        clinicCard.classList.add('clinic-card');
        clinicCard.style.backgroundColor = getRandomColor(); // Atribui uma cor aleatória ou pode ser uma cor fixa

        clinicCard.innerHTML = `
            <h3>${clinica.name}</h3>
            <button onclick="window.location.href='agendar.html?clinicId=${clinica.id}'">Agende Conosco</button>
        `;

        container.appendChild(clinicCard);
    });
}

// Função para gerar uma cor de fundo aleatória para cada clínica
function getRandomColor() {
    const colors = ['#b39ddb', '#f48fb1', '#90caf9', '#a5d6a7', '#ffeb3b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Carregar as clínicas ao carregar a página
document.addEventListener('DOMContentLoaded', carregarClinicas);