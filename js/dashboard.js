// 1. Pegando os elementos do HTML
const botaoMenu = document.querySelector('#menu-toggle');
const menu = document.querySelector('#menu');
const linksMenu = document.querySelectorAll('#menu a');
const botaoSair = document.querySelector('#botao-sair');
const nomeUsuario = document.querySelector('#nome-usuario');
const totalUsuarios = document.querySelector('#total-usuarios');
const totalCadastro1 = document.querySelector('#total-cadastro1');
const totalCadastro2 = document.querySelector('#total-cadastro2');

// 2. Abrir e fechar o menu lateral (celular e tablet)
function alternarMenu() {
    const aberto = menu.classList.toggle('menu--aberto');

    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

function fecharMenu() {
    menu.classList.remove('menu--aberto');

    botaoMenu.setAttribute('aria-expanded', false);
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

// 3. Contar quantos registros uma lista salva tem
function contarRegistros(chave) {
    const lista = JSON.parse(localStorage.getItem(chave));

    if (lista === null) {
        return 0;
    }

    return lista.length;
}

// 4. Preencher a página com o nome e os totais
function mostrarDados() {
    nomeUsuario.textContent = usuarioLogado.nome;

    totalUsuarios.textContent = contarRegistros('usuarios');
    totalCadastro1.textContent = contarRegistros('cadastro1');
    totalCadastro2.textContent = contarRegistros('cadastro2');
}

// 5. Ligando tudo aos eventos
mostrarDados();

botaoMenu.addEventListener('click', alternarMenu);
botaoSair.addEventListener('click', sair);

linksMenu.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});
