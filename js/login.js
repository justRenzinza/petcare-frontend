const urlBackend = 'http://54.174.116.135:3001';

document.getElementById('formLogin').addEventListener('submit', async (event) => {
console.log('chegamos aqui');
    event.preventDefault();

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputSenha').value;

    try {
        const response = await fetch(`${urlBackend}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // a local storage ta armazenando o token JWT gerado
        localStorage.setItem('id',data.id);
        alert('Login bem-sucedido!');
        window.location.href = 'index.html'; // volta pra pagina inicial depois de efetuar o login
    } catch (error) {
        alert(error.message);
    }
});
