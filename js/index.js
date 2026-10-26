// 1. Pegando os elementos do HTML
const botaoMenu = document.querySelector('#menu-toggle');
const menu = document.querySelector('#menu');
const linksMenu = document.querySelectorAll('#menu a');

// 2. Abrir e fechar o menu no celular
function alternarMenu() {
    const aberto = menu.classList.toggle('header__nav--aberto');

    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

function fecharMenu() {
    menu.classList.remove('header__nav--aberto');

    botaoMenu.setAttribute('aria-expanded', false);
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu.addEventListener('click', alternarMenu);

// 3. Fechar o menu quando clicar em um link
linksMenu.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});

// 4. Ano atual no rodapé
const ano = document.querySelector('#ano');
ano.textContent = new Date().getFullYear();
