// 1. Pegando os elementos do HTML
const formLogin = document.querySelector('#form-login');
const campoLogin = document.querySelector('#campo-login');
const campoSenha = document.querySelector('#campo-senha');
const mensagemErro = document.querySelector('#mensagem-erro');

// 2. Criar o primeiro usuário, se a lista ainda não existir
function criarUsuarioInicial() {
    if (localStorage.getItem('usuarios') === null) {
        const usuarios = [
            {
                id: 1,
                nome: 'Administrador',
                login: 'admin',
                senha: '123456',
                atualizadoEm: '2026-10-23T10:00'
            }
        ];

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// 3. Mostrar e limpar as mensagens de erro
function mostrarErro(texto, campo) {
    mensagemErro.textContent = texto;
    campo.classList.add('form__input--erro');
    campo.setAttribute('aria-invalid', true);
    campo.focus();
}

function limparErro() {
    mensagemErro.textContent = '';

    campoLogin.classList.remove('form__input--erro');
    campoLogin.removeAttribute('aria-invalid');

    campoSenha.classList.remove('form__input--erro');
    campoSenha.removeAttribute('aria-invalid');
}

// 4. Validar o preenchimento dos campos
function formularioValido(login, senha) {
    if (login === '') {
        mostrarErro('Informe o login.', campoLogin);
        return false;
    }

    if (senha === '') {
        mostrarErro('Informe a senha.', campoSenha);
        return false;
    }

    if (senha.length < 6) {
        mostrarErro('A senha deve ter pelo menos 6 caracteres.', campoSenha);
        return false;
    }

    return true;
}

// 5. Procurar o usuário na lista salva no navegador
function buscarUsuario(login, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));

    return usuarios.find(function (usuario) {
        return usuario.login === login && usuario.senha === senha;
    });
}

// 6. Entrar no sistema
function entrar(evento) {
    evento.preventDefault();
    limparErro();

    const login = campoLogin.value.trim();
    const senha = campoSenha.value;

    if (!formularioValido(login, senha)) {
        return;
    }

    const usuario = buscarUsuario(login, senha);

    if (usuario === undefined) {
        mostrarErro('Login ou senha incorretos.', campoSenha);
        return;
    }

    const sessao = { id: usuario.id, nome: usuario.nome, login: usuario.login };

    sessionStorage.setItem('usuarioLogado', JSON.stringify(sessao));
    window.location.href = 'dashboard.html';
}

// 7. Ligando tudo aos eventos
criarUsuarioInicial();

formLogin.addEventListener('submit', entrar);
campoLogin.addEventListener('input', limparErro);
campoSenha.addEventListener('input', limparErro);
