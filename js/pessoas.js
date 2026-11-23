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

const janela = document.querySelector('#janela-pessoa');
const tituloJanela = document.querySelector('#titulo-janela');
const formPessoa = document.querySelector('#form-pessoa');
const campoNome = document.querySelector('#campo-nome');
const campoCpf = document.querySelector('#campo-cpf');
const campoNascimento = document.querySelector('#campo-nascimento');
const campoTelefone = document.querySelector('#campo-telefone');
const campoTipo = document.querySelector('#campo-tipo');
const mensagemErro = document.querySelector('#mensagem-erro');
const botaoFechar = document.querySelector('#botao-fechar');
const botaoCancelar = document.querySelector('#botao-cancelar');

// Guarda o id da pessoa que está sendo editada (null = nova pessoa)
let idEmEdicao = null;

// Tipos de pessoa (tabela tbPessoaTipo do DER) usados na primeira vez
const tiposIniciais = [
    { id: 1, descricao: 'Funcionário' },
    { id: 2, descricao: 'Gestor' },
    { id: 3, descricao: 'Instrutor' },
    { id: 4, descricao: 'RH' }
];

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

// 3. Ler e gravar a lista de pessoas no localStorage
function lerPessoas() {
    const lista = JSON.parse(localStorage.getItem('pessoas'));

    if (lista === null) {
        return [];
    }

    return lista;
}

function gravarPessoas(pessoas) {
    localStorage.setItem('pessoas', JSON.stringify(pessoas));
}

// 4. Tipos de pessoa: ler, preencher o select e achar a descrição
function lerTipos() {
    const lista = JSON.parse(localStorage.getItem('pessoaTipos'));

    if (lista === null) {
        localStorage.setItem('pessoaTipos', JSON.stringify(tiposIniciais));
        return tiposIniciais;
    }

    return lista;
}

function preencherTipos() {
    lerTipos().forEach(function (tipo) {
        const opcao = document.createElement('option');
        opcao.value = tipo.id;
        opcao.textContent = tipo.descricao;
        campoTipo.appendChild(opcao);
    });
}

function descricaoTipo(id) {
    const tipo = lerTipos().find(function (item) {
        return item.id === id;
    });

    if (tipo === undefined) {
        return '-';
    }

    return tipo.descricao;
}

// 5. Máscaras: CPF 000.000.000-00 e telefone (00) 00000-0000
function somenteNumeros(texto) {
    return texto.replace(/\D/g, '');
}

function mascararCpf() {
    const n = somenteNumeros(campoCpf.value).slice(0, 11);
    let texto = n;

    if (n.length > 9) {
        texto = n.slice(0, 3) + '.' + n.slice(3, 6) + '.' + n.slice(6, 9) + '-' + n.slice(9);
    } else if (n.length > 6) {
        texto = n.slice(0, 3) + '.' + n.slice(3, 6) + '.' + n.slice(6);
    } else if (n.length > 3) {
        texto = n.slice(0, 3) + '.' + n.slice(3);
    }

    campoCpf.value = texto;
}

function mascararTelefone() {
    const n = somenteNumeros(campoTelefone.value).slice(0, 11);
    let texto = n;

    if (n.length > 10) {
        texto = '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7);
    } else if (n.length > 6) {
        texto = '(' + n.slice(0, 2) + ') ' + n.slice(2, 6) + '-' + n.slice(6);
    } else if (n.length > 2) {
        texto = '(' + n.slice(0, 2) + ') ' + n.slice(2);
    }

    campoTelefone.value = texto;
}

// 6. Funções de apoio
function proximoId(pessoas) {
    let maior = 0;

    pessoas.forEach(function (pessoa) {
        if (pessoa.id > maior) {
            maior = pessoa.id;
        }
    });

    return maior + 1;
}

// Recebe '2000-05-10' (formato do input date) e devolve '10/05/2000'
function formatarData(texto) {
    const partes = texto.split('-');

    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function hoje() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');

    return agora.getFullYear() + '-' + mes + '-' + dia;
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

// 7. LISTAR: montar as linhas da tabela (com a pesquisa)
function listarPessoas() {
    const termo = campoPesquisa.value.trim().toLowerCase();
    const termoNumeros = somenteNumeros(termo);

    const pessoas = lerPessoas().filter(function (pessoa) {
        const achouNome = pessoa.nome.toLowerCase().includes(termo);
        const achouCpf = termoNumeros !== '' && somenteNumeros(pessoa.cpf).includes(termoNumeros);

        return achouNome || achouCpf;
    });

    corpoTabela.innerHTML = '';

    pessoas.forEach(function (pessoa) {
        const linha = document.createElement('tr');

        linha.appendChild(criarCelula(pessoa.id));
        linha.appendChild(criarCelula(pessoa.nome));
        linha.appendChild(criarCelula(pessoa.cpf));
        linha.appendChild(criarCelula(formatarData(pessoa.nascimento)));
        linha.appendChild(criarCelula(pessoa.telefone || '-'));
        linha.appendChild(criarCelula(descricaoTipo(pessoa.pessoaTipoId)));

        const acoes = document.createElement('td');

        acoes.appendChild(criarBotao('Editar', 'botao-editar', function () {
            abrirEdicao(pessoa.id);
        }));

        acoes.appendChild(criarBotao('Excluir', 'botao-excluir', function () {
            excluirPessoa(pessoa.id);
        }));

        linha.appendChild(acoes);
        corpoTabela.appendChild(linha);
    });

    mensagemVazia.hidden = pessoas.length > 0;
}

// 8. Abrir e fechar a janela do formulário
function abrirNovo() {
    idEmEdicao = null;
    tituloJanela.textContent = 'Nova pessoa';
    formPessoa.reset();
    limparErro();
    janela.showModal();
}

function abrirEdicao(id) {
    const pessoa = lerPessoas().find(function (item) {
        return item.id === id;
    });

    idEmEdicao = id;
    tituloJanela.textContent = 'Editar pessoa';
    campoNome.value = pessoa.nome;
    campoCpf.value = pessoa.cpf;
    campoNascimento.value = pessoa.nascimento;
    campoTelefone.value = pessoa.telefone;
    campoTipo.value = pessoa.pessoaTipoId;
    limparErro();
    janela.showModal();
}

function fecharJanela() {
    janela.close();
}

// 9. Mostrar e limpar as mensagens de erro
function mostrarErro(texto, campo) {
    mensagemErro.textContent = texto;
    campo.classList.add('erro');
    campo.setAttribute('aria-invalid', true);
    campo.focus();
}

function limparErro() {
    mensagemErro.textContent = '';

    [campoNome, campoCpf, campoNascimento, campoTelefone, campoTipo].forEach(function (campo) {
        campo.classList.remove('erro');
        campo.removeAttribute('aria-invalid');
    });
}

// 10. Validar o formulário
function cpfEmUso(cpf) {
    return lerPessoas().some(function (pessoa) {
        return pessoa.cpf === cpf && pessoa.id !== idEmEdicao;
    });
}

function formularioValido(dados) {
    if (dados.nome === '') {
        mostrarErro('Informe o nome.', campoNome);
        return false;
    }

    if (somenteNumeros(dados.cpf).length !== 11) {
        mostrarErro('Informe o CPF completo (11 números).', campoCpf);
        return false;
    }

    if (cpfEmUso(dados.cpf)) {
        mostrarErro('Este CPF já está cadastrado.', campoCpf);
        return false;
    }

    if (dados.nascimento === '') {
        mostrarErro('Informe a data de nascimento.', campoNascimento);
        return false;
    }

    if (dados.nascimento > hoje()) {
        mostrarErro('A data de nascimento não pode ser no futuro.', campoNascimento);
        return false;
    }

    const digitosTelefone = somenteNumeros(dados.telefone).length;

    if (digitosTelefone > 0 && digitosTelefone < 10) {
        mostrarErro('Telefone incompleto. Use (00) 00000-0000.', campoTelefone);
        return false;
    }

    if (dados.pessoaTipoId === 0) {
        mostrarErro('Selecione o tipo de pessoa.', campoTipo);
        return false;
    }

    return true;
}

// 11. INCLUIR e EDITAR: salvar o formulário
function salvarPessoa(evento) {
    evento.preventDefault();
    limparErro();

    const dados = {
        nome: campoNome.value.trim(),
        cpf: campoCpf.value,
        nascimento: campoNascimento.value,
        telefone: campoTelefone.value,
        pessoaTipoId: Number(campoTipo.value)
    };

    if (!formularioValido(dados)) {
        return;
    }

    const pessoas = lerPessoas();
    const agora = new Date().toISOString();

    if (idEmEdicao === null) {
        pessoas.push({
            id: proximoId(pessoas),
            nome: dados.nome,
            cpf: dados.cpf,
            nascimento: dados.nascimento,
            telefone: dados.telefone,
            pessoaTipoId: dados.pessoaTipoId,
            atualizadoEm: agora,
            atualizadoPor: usuarioLogado.id
        });
    } else {
        const pessoa = pessoas.find(function (item) {
            return item.id === idEmEdicao;
        });

        pessoa.nome = dados.nome;
        pessoa.cpf = dados.cpf;
        pessoa.nascimento = dados.nascimento;
        pessoa.telefone = dados.telefone;
        pessoa.pessoaTipoId = dados.pessoaTipoId;
        pessoa.atualizadoEm = agora;
        pessoa.atualizadoPor = usuarioLogado.id;
    }

    gravarPessoas(pessoas);
    fecharJanela();
    listarPessoas();
}

// 12. EXCLUIR: pedir confirmação e remover da lista
function excluirPessoa(id) {
    const pessoas = lerPessoas();

    const pessoa = pessoas.find(function (item) {
        return item.id === id;
    });

    if (!confirm('Excluir a pessoa "' + pessoa.nome + '"?')) {
        return;
    }

    const restantes = pessoas.filter(function (item) {
        return item.id !== id;
    });

    gravarPessoas(restantes);
    listarPessoas();
}

// 13. Ligando tudo aos eventos
nomeUsuario.textContent = usuarioLogado.nome;
preencherTipos();
campoNascimento.max = hoje();
listarPessoas();

botaoMenu.addEventListener('click', alternarMenu);
botaoSair.addEventListener('click', sair);

linksMenu.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});

botaoNovo.addEventListener('click', abrirNovo);
campoPesquisa.addEventListener('input', listarPessoas);

formPessoa.addEventListener('submit', salvarPessoa);
botaoFechar.addEventListener('click', fecharJanela);
botaoCancelar.addEventListener('click', fecharJanela);

campoCpf.addEventListener('input', mascararCpf);
campoTelefone.addEventListener('input', mascararTelefone);

[campoNome, campoCpf, campoNascimento, campoTelefone].forEach(function (campo) {
    campo.addEventListener('input', limparErro);
});

campoTipo.addEventListener('change', limparErro);
