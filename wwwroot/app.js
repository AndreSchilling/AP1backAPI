/**
 * Catálogo de Jogos - Gerenciamento Integrado à API (AP1)
 * JavaScript Puro (Vanilla JS)
 * 
 * Especificação baseada na collection validada do Bruno:
 * - GET    /api/jogos        -> 200 OK (Lista de jogos)
 * - POST   /api/jogos        -> 201 Created (Body: { "titulo": "..." })
 * - PUT    /api/jogos/{id}   -> 200 OK (Body: { "titulo": "..." })
 * - DELETE /api/jogos/{id}   -> 204 No Content
 *
 * Diretrizes de Segurança:
 * - Uso estrito de textContent para atribuição de textos e dados no DOM.
 * - Tratamento completo de status HTTP, estados de carregamento e lista vazia.
 * - Sem dados fictícios ou dependências externas.
 */

'use strict';

// Determina a URL base da API:
// Se servida no mesmo host/porta da API (ex: 5050 ou 5107), usa rota relativa '/api/jogos'.
// Se acessada via file:// ou Live Server em outra porta, aponta para 'http://localhost:5050/api/jogos'.
const API_URL = (window.location.protocol.startsWith('http') && (window.location.port === '5050' || window.location.port === '5107'))
  ? '/api/jogos'
  : 'http://localhost:5050/api/jogos';

// Estado local da aplicação
let listaJogos = [];
let idEmEdicao = null;
let temporizadorMensagem = null;

// Referências aos elementos do DOM
const formJogo = document.getElementById('form-jogo');
const inputJogoId = document.getElementById('jogo-id');
const inputTitulo = document.getElementById('input-titulo');
const formTitulo = document.getElementById('form-titulo');
const formInstrucao = document.getElementById('form-instrucao');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnLimpar = document.getElementById('btn-limpar');
const btnRecarregar = document.getElementById('btn-recarregar');

const mensagemStatus = document.getElementById('mensagem-status');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingTexto = document.getElementById('loading-texto');
const tabelaCorpo = document.getElementById('tabela-corpo');
const emptyState = document.getElementById('empty-state');
const emptyStateMensagem = document.getElementById('empty-state-mensagem');
const contadorJogos = document.getElementById('contador-jogos');
const filtroBusca = document.getElementById('filtro-busca');

/**
 * Funções utilitárias para extração segura de campos de retorno da API
 */
function obterId(item) {
  if (!item) return '';
  return item.id !== undefined ? item.id : (item.Id !== undefined ? item.Id : '');
}

function obterTitulo(item) {
  if (!item) return '';
  return item.titulo || item.Titulo || item.jogo || item.Jogo || item.nome || item.Nome || '';
}

/**
 * Controla o indicador de carregamento e o estado dos botões da interface
 */
function definirCarregando(ativo, texto = 'Carregando dados da API...') {
  if (loadingIndicator && loadingTexto) {
    loadingTexto.textContent = texto;
    loadingIndicator.style.display = ativo ? 'flex' : 'none';
  }

  if (btnSalvar) btnSalvar.disabled = ativo;
  if (btnRecarregar) btnRecarregar.disabled = ativo;
  if (btnCancelar) btnCancelar.disabled = ativo;
  if (btnLimpar) btnLimpar.disabled = ativo;
}

/**
 * Exibe mensagens informativas ou de erro usando textContent estrito
 */
function exibirMensagem(texto, tipo = 'info', tempoMs = 6000) {
  if (!mensagemStatus) return;

  if (temporizadorMensagem) {
    clearTimeout(temporizadorMensagem);
  }

  mensagemStatus.textContent = texto;
  mensagemStatus.className = `mensagem-status ${tipo}`;

  temporizadorMensagem = setTimeout(() => {
    limparMensagem();
  }, tempoMs);
}

/**
 * Oculta e limpa a mensagem de status
 */
function limparMensagem() {
  if (!mensagemStatus) return;
  mensagemStatus.textContent = '';
  mensagemStatus.className = 'mensagem-status';
}

/**
 * Alterna a interface para o modo de edição de um jogo
 */
function ativarModoEdicao(jogo) {
  const id = obterId(jogo);
  const titulo = obterTitulo(jogo);

  idEmEdicao = id;
  inputJogoId.value = String(id);
  inputTitulo.value = titulo;

  formTitulo.textContent = `Editar Jogo #${id}`;
  formInstrucao.textContent = 'Modifique o título do jogo e clique em "Salvar Alterações".';
  btnSalvar.textContent = 'Salvar Alterações';
  btnCancelar.style.display = 'inline-flex';

  inputTitulo.focus();
  formJogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Restaura o formulário para o modo padrão de criação
 */
function cancelarEdicao() {
  idEmEdicao = null;
  inputJogoId.value = '';
  inputTitulo.value = '';

  formTitulo.textContent = 'Cadastrar Novo Jogo';
  formInstrucao.textContent = 'Informe o título do jogo para cadastrá-lo na API.';
  btnSalvar.textContent = 'Cadastrar Jogo';
  btnCancelar.style.display = 'none';
}

/**
 * Renderiza as linhas da tabela inserindo todos os valores via textContent
 */
function renderizarTabela(itens) {
  if (!tabelaCorpo) return;

  // Limpa o conteúdo da tabela
  tabelaCorpo.textContent = '';

  if (!itens || itens.length === 0) {
    if (emptyState) {
      emptyState.style.display = 'block';
      if (filtroBusca && filtroBusca.value.trim() !== '') {
        emptyStateMensagem.textContent = 'Nenhum jogo encontrado com o termo pesquisado.';
      } else {
        emptyStateMensagem.textContent = 'Nenhum jogo cadastrado no momento.';
      }
    }
  } else {
    if (emptyState) emptyState.style.display = 'none';

    itens.forEach(item => {
      const id = obterId(item);
      const titulo = obterTitulo(item);

      const tr = document.createElement('tr');

      // Coluna ID
      const tdId = document.createElement('td');
      const spanId = document.createElement('span');
      spanId.className = 'badge-id';
      spanId.textContent = String(id);
      tdId.appendChild(spanId);

      // Coluna Título
      const tdTitulo = document.createElement('td');
      const strongTitulo = document.createElement('strong');
      strongTitulo.textContent = String(titulo);
      tdTitulo.appendChild(strongTitulo);

      // Coluna Ações
      const tdAcoes = document.createElement('td');
      tdAcoes.className = 'col-acoes';

      const btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.className = 'btn btn-sm btn-edit';
      btnEditar.textContent = 'Editar';
      btnEditar.title = `Editar jogo #${id}`;
      btnEditar.addEventListener('click', () => ativarModoEdicao(item));

      const btnExcluir = document.createElement('button');
      btnExcluir.type = 'button';
      btnExcluir.className = 'btn btn-sm btn-danger';
      btnExcluir.textContent = 'Excluir';
      btnExcluir.title = `Excluir jogo #${id}`;
      btnExcluir.addEventListener('click', () => confirmarExclusao(id, titulo));

      tdAcoes.appendChild(btnEditar);
      tdAcoes.appendChild(btnExcluir);

      tr.appendChild(tdId);
      tr.appendChild(tdTitulo);
      tr.appendChild(tdAcoes);

      tabelaCorpo.appendChild(tr);
    });
  }

  if (contadorJogos) {
    const total = itens ? itens.length : 0;
    contadorJogos.textContent = `Total: ${total} ${total === 1 ? 'jogo' : 'jogos'}`;
  }
}

/**
 * Filtra a lista em memória conforme digitação do usuário
 */
function aplicarFiltro() {
  const termo = filtroBusca ? filtroBusca.value.trim().toLowerCase() : '';

  if (!termo) {
    renderizarTabela(listaJogos);
    return;
  }

  const filtrados = listaJogos.filter(item => {
    const id = String(obterId(item)).toLowerCase();
    const titulo = String(obterTitulo(item)).toLowerCase();
    return id.includes(termo) || titulo.includes(termo);
  });

  renderizarTabela(filtrados);
}

/* ==========================================================================
   Operações da API (GET, POST, PUT, DELETE)
   ========================================================================== */

/**
 * 01 - Listar Jogos (GET /api/jogos)
 */
async function listarJogos() {
  definirCarregando(true, 'Consultando lista de jogos na API...');

  try {
    const resposta = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (resposta.status === 200 || resposta.ok) {
      const dados = await resposta.json();
      listaJogos = Array.isArray(dados) ? dados : [];
      aplicarFiltro();
    } else {
      listaJogos = [];
      renderizarTabela([]);
      exibirMensagem(
        `Erro ao buscar jogos: Status HTTP ${resposta.status} (${resposta.statusText || 'Falha na requisição'}).`,
        'erro'
      );
    }
  } catch (erro) {
    listaJogos = [];
    renderizarTabela([]);
    exibirMensagem(
      `Não foi possível conectar à API em ${API_URL}. Verifique se o servidor está ativo. (${erro.message})`,
      'erro',
      8000
    );
  } finally {
    definirCarregando(false);
  }
}

/**
 * 03 - Cadastrar Jogo (POST /api/jogos)
 */
async function cadastrarJogo(titulo) {
  definirCarregando(true, 'Cadastrando jogo na API...');

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ titulo: titulo, jogo: titulo })
    });

    if (resposta.status === 201 || resposta.ok) {
      exibirMensagem(
        `Jogo "${titulo}" cadastrado com sucesso! (Status HTTP ${resposta.status} Created)`,
        'sucesso'
      );
      inputTitulo.value = '';
      await listarJogos();
    } else {
      let detalhe = '';
      try {
        const corpoErro = await resposta.text();
        if (corpoErro) detalhe = ` - ${corpoErro}`;
      } catch (_) {}

      exibirMensagem(
        `Falha ao cadastrar: Status HTTP ${resposta.status} (${resposta.statusText})${detalhe}`,
        'erro'
      );
    }
  } catch (erro) {
    exibirMensagem(
      `Erro de conexão ao tentar cadastrar jogo: ${erro.message}`,
      'erro'
    );
  } finally {
    definirCarregando(false);
  }
}

/**
 * 04 - Atualizar Jogo (PUT /api/jogos/{id})
 */
async function atualizarJogo(id, titulo) {
  definirCarregando(true, `Atualizando jogo #${id} na API...`);

  try {
    const url = `${API_URL}/${encodeURIComponent(id)}`;
    const resposta = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ titulo: titulo, jogo: titulo })
    });

    if (resposta.status === 200 || resposta.ok) {
      exibirMensagem(
        `Jogo #${id} atualizado com sucesso! (Status HTTP ${resposta.status} OK)`,
        'sucesso'
      );
      cancelarEdicao();
      await listarJogos();
    } else if (resposta.status === 404) {
      exibirMensagem(
        `Jogo #${id} não foi encontrado na API para atualização (Status HTTP 404 Not Found).`,
        'erro'
      );
    } else {
      let detalhe = '';
      try {
        const corpoErro = await resposta.text();
        if (corpoErro) detalhe = ` - ${corpoErro}`;
      } catch (_) {}

      exibirMensagem(
        `Falha ao atualizar: Status HTTP ${resposta.status} (${resposta.statusText})${detalhe}`,
        'erro'
      );
    }
  } catch (erro) {
    exibirMensagem(
      `Erro de conexão ao tentar atualizar o jogo: ${erro.message}`,
      'erro'
    );
  } finally {
    definirCarregando(false);
  }
}

/**
 * 05 - Remover Jogo (DELETE /api/jogos/{id})
 */
async function excluirJogo(id, titulo) {
  definirCarregando(true, `Excluindo jogo #${id} da API...`);

  try {
    const url = `${API_URL}/${encodeURIComponent(id)}`;
    const resposta = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (resposta.status === 204 || resposta.status === 200 || resposta.ok) {
      exibirMensagem(
        `Jogo #${id} removido com sucesso! (Status HTTP ${resposta.status} ${resposta.status === 204 ? 'No Content' : 'OK'})`,
        'sucesso'
      );

      // Se o jogo excluído estava sendo editado, volta o formulário ao modo de criação
      if (String(idEmEdicao) === String(id)) {
        cancelarEdicao();
      }

      await listarJogos();
    } else if (resposta.status === 404) {
      exibirMensagem(
        `Jogo #${id} não foi encontrado para exclusão (Status HTTP 404 Not Found).`,
        'erro'
      );
    } else {
      exibirMensagem(
        `Falha ao excluir: Status HTTP ${resposta.status} (${resposta.statusText})`,
        'erro'
      );
    }
  } catch (erro) {
    exibirMensagem(
      `Erro de conexão ao tentar excluir o jogo: ${erro.message}`,
      'erro'
    );
  } finally {
    definirCarregando(false);
  }
}

/**
 * Solicita confirmação antes de disparar a exclusão
 */
function confirmarExclusao(id, titulo) {
  const mensagem = `Deseja realmente excluir o jogo #${id} ("${titulo}") da API?`;
  if (window.confirm(mensagem)) {
    excluirJogo(id, titulo);
  }
}

/**
 * Trata a submissão do formulário unificado (Criar ou Atualizar)
 */
function lidarComEnvioFormulario(evento) {
  evento.preventDefault();

  const tituloLimpo = inputTitulo.value.trim();

  if (!tituloLimpo) {
    exibirMensagem('Por favor, informe o título do jogo.', 'erro');
    inputTitulo.focus();
    return;
  }

  if (idEmEdicao !== null && idEmEdicao !== '') {
    atualizarJogo(idEmEdicao, tituloLimpo);
  } else {
    cadastrarJogo(tituloLimpo);
  }
}

/**
 * Limpa os campos do formulário
 */
function limparFormulario() {
  if (idEmEdicao !== null) {
    cancelarEdicao();
  } else {
    inputTitulo.value = '';
  }
  limparMensagem();
  inputTitulo.focus();
}

// Inicialização de ouvintes e carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
  if (formJogo) {
    formJogo.addEventListener('submit', lidarComEnvioFormulario);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', cancelarEdicao);
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', limparFormulario);
  }

  if (btnRecarregar) {
    btnRecarregar.addEventListener('click', listarJogos);
  }

  if (filtroBusca) {
    filtroBusca.addEventListener('input', aplicarFiltro);
  }

  // Carrega os dados reais da API ao abrir a página
  listarJogos();
});
