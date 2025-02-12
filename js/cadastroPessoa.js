const urlBackend = 'URL_DO_BACKEND'; //lembrar de trocar depois pela real
async function criarUsuario(name, email, password) {
    try {
        const response = await fetch(`${urlBackend}URL_DO_BACKEND/users`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        console.log('Usuário criado:', data);
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
}

// se pa valia a pena colocar isso no cadastropessoa de uma vez
document.getElementById('formCadastro').addEventListener('submit', (event) => {
    event.preventDefault(); 

    const name = document.getElementById('inputNome').value;
    const email = document.getElementById('inputLogin').value; 
    const password = document.getElementById('inputSenha').value;

    criarUsuario(name, email, password);
});
