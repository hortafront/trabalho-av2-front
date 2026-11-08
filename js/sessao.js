// 1. Ler quem está logado (o login guardou esse objeto no sessionStorage)
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

// 2. Proteção das telas internas: sem login, volta para o login
function protegerPagina() {
    if (sessionStorage.getItem('usuarioLogado') === null) {
        window.location.replace('login.html');
    }
}

protegerPagina();

// O botão Voltar pode mostrar a página guardada na memória sem rodar o JS de novo.
// O evento pageshow acontece também nesse caso, então a proteção roda outra vez.
window.addEventListener('pageshow', protegerPagina);

// 3. Sair do sistema: apaga a sessão e volta para o login
function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.replace('login.html');
}
