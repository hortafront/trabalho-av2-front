// 1. Pegando os elementos do HTML
const botaoMenu = document.querySelector('#menu-toggle');
const menu = document.querySelector('#menu');
const linksMenu = document.querySelectorAll('#menu a');
const botaoSair = document.querySelector('#botao-sair');
const nomeUsuario = document.querySelector('#nome-usuario');

const botaoNovo = document.querySelector('#botao-novo');
const campoPesquisa = document.querySelector('#campo-pesquisa');
const corpoTabela = document.querySelector('#corpo-tabela');
const mensagemVazia = document.querySelector('#mensagem-vazia');

const janela = document.querySelector('#janela-usuario');
const tituloJanela = document.querySelector('#titulo-janela');
const formUsuario = document.querySelector('#form-usuario');
const campoNome = document.querySelector('#campo-nome');
const campoLogin = document.querySelector('#campo-login');
const campoSenha = document.querySelector('#campo-senha');
const mensagemErro = document.querySelector('#mensagem-erro');
const botaoFechar = document.querySelector('#botao-fechar');
const botaoCancelar = document.querySelector('#botao-cancelar');

// Guarda o id do usuário que está sendo editado (null = novo usuário)
let idEmEdicao = null;

// 2. Abrir e fechar o menu lateral (celular e tablet)
function alternarMenu() {
    const aberto = menu.classList.toggle('aberto');

    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

function fecharMenu() {
    menu.classList.remove('aberto');

    botaoMenu.setAttribute('aria-expanded', false);
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

// 3. Ler e gravar a lista de usuários no localStorage
function lerUsuarios() {
    const lista = JSON.parse(localStorage.getItem('usuarios'));

    if (lista === null) {
        return [];
    }

    return lista;
}

function gravarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// 4. Funções de apoio
function proximoId(usuarios) {
    let maior = 0;

    usuarios.forEach(function (usuario) {
        if (usuario.id > maior) {
            maior = usuario.id;
        }
    });

    return maior + 1;
}

function formatarData(texto) {
    const data = new Date(texto);

    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function criarCelula(texto) {
    const celula = document.createElement('td');
    celula.textContent = texto;
    return celula;
}

function criarBotao(texto, classe, acao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener('click', acao);
    return botao;
}

// 5. LISTAR: montar as linhas da tabela (com a pesquisa)
function listarUsuarios() {
    const termo = campoPesquisa.value.trim().toLowerCase();

    const usuarios = lerUsuarios().filter(function (usuario) {
        return usuario.nome.toLowerCase().includes(termo) ||
               usuario.login.toLowerCase().includes(termo);
    });

    corpoTabela.innerHTML = '';

    usuarios.forEach(function (usuario) {
        const linha = document.createElement('tr');

        linha.appendChild(criarCelula(usuario.id));
        linha.appendChild(criarCelula(usuario.nome));
        linha.appendChild(criarCelula(usuario.login));
        linha.appendChild(criarCelula(formatarData(usuario.atualizadoEm)));

        const acoes = document.createElement('td');

        acoes.appendChild(criarBotao('Editar', 'botao-editar', function () {
            abrirEdicao(usuario.id);
        }));

        const botaoExcluir = criarBotao('Excluir', 'botao-excluir', function () {
            excluirUsuario(usuario.id);
        });

        // Ninguém pode excluir o usuário com que está logado
        if (usuario.id === usuarioLogado.id) {
            botaoExcluir.disabled = true;
            botaoExcluir.title = 'Você está logado com este usuário';
        }

        acoes.appendChild(botaoExcluir);
        linha.appendChild(acoes);

        corpoTabela.appendChild(linha);
    });

    mensagemVazia.hidden = usuarios.length > 0;
}

// 6. Abrir e fechar a janela do formulário
function abrirNovo() {
    idEmEdicao = null;
    tituloJanela.textContent = 'Novo usuário';
    formUsuario.reset();
    limparErro();
    janela.showModal();
}

function abrirEdicao(id) {
    const usuario = lerUsuarios().find(function (item) {
        return item.id === id;
    });

    idEmEdicao = id;
    tituloJanela.textContent = 'Editar usuário';
    campoNome.value = usuario.nome;
    campoLogin.value = usuario.login;
    campoSenha.value = usuario.senha;
    limparErro();
    janela.showModal();
}

function fecharJanela() {
    janela.close();
}

// 7. Mostrar e limpar as mensagens de erro
function mostrarErro(texto, campo) {
    mensagemErro.textContent = texto;
    campo.classList.add('erro');
    campo.setAttribute('aria-invalid', true);
    campo.focus();
}

function limparErro() {
    mensagemErro.textContent = '';

    [campoNome, campoLogin, campoSenha].forEach(function (campo) {
        campo.classList.remove('erro');
        campo.removeAttribute('aria-invalid');
    });
}

// 8. Validar o formulário
function loginEmUso(login) {
    return lerUsuarios().some(function (usuario) {
        return usuario.login === login && usuario.id !== idEmEdicao;
    });
}

function formularioValido(nome, login, senha) {
    if (nome === '') {
        mostrarErro('Informe o nome.', campoNome);
        return false;
    }

    if (login === '') {
        mostrarErro('Informe o login.', campoLogin);
        return false;
    }

    if (loginEmUso(login)) {
        mostrarErro('Este login já está em uso.', campoLogin);
        return false;
    }

    if (senha.length < 6) {
        mostrarErro('A senha deve ter pelo menos 6 caracteres.', campoSenha);
        return false;
    }

    return true;
}

// 9. INCLUIR e EDITAR: salvar o formulário
function salvarUsuario(evento) {
    evento.preventDefault();
    limparErro();

    const nome = campoNome.value.trim();
    const login = campoLogin.value.trim();
    const senha = campoSenha.value;

    if (!formularioValido(nome, login, senha)) {
        return;
    }

    const usuarios = lerUsuarios();
    const agora = new Date().toISOString();

    if (idEmEdicao === null) {
        usuarios.push({
            id: proximoId(usuarios),
            nome: nome,
            login: login,
            senha: senha,
            atualizadoEm: agora,
            atualizadoPor: usuarioLogado.id
        });
    } else {
        const usuario = usuarios.find(function (item) {
            return item.id === idEmEdicao;
        });

        usuario.nome = nome;
        usuario.login = login;
        usuario.senha = senha;
        usuario.atualizadoEm = agora;
        usuario.atualizadoPor = usuarioLogado.id;

        // Se editou a si mesmo, atualiza a sessão e o "Olá"
        if (usuario.id === usuarioLogado.id) {
            usuarioLogado.nome = nome;
            usuarioLogado.login = login;
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            nomeUsuario.textContent = nome;
        }
    }

    gravarUsuarios(usuarios);
    fecharJanela();
    listarUsuarios();
}

// 10. EXCLUIR: pedir confirmação e remover da lista
function excluirUsuario(id) {
    const usuarios = lerUsuarios();

    const usuario = usuarios.find(function (item) {
        return item.id === id;
    });

    if (!confirm('Excluir o usuário "' + usuario.nome + '"?')) {
        return;
    }

    const restantes = usuarios.filter(function (item) {
        return item.id !== id;
    });

    gravarUsuarios(restantes);
    listarUsuarios();
}

// 11. Ligando tudo aos eventos
nomeUsuario.textContent = usuarioLogado.nome;
listarUsuarios();

botaoMenu.addEventListener('click', alternarMenu);
botaoSair.addEventListener('click', sair);

linksMenu.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});

botaoNovo.addEventListener('click', abrirNovo);
campoPesquisa.addEventListener('input', listarUsuarios);

formUsuario.addEventListener('submit', salvarUsuario);
botaoFechar.addEventListener('click', fecharJanela);
botaoCancelar.addEventListener('click', fecharJanela);

campoNome.addEventListener('input', limparErro);
campoLogin.addEventListener('input', limparErro);
campoSenha.addEventListener('input', limparErro);
