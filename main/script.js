// ===================== CONFIGURAÇÃO =====================
const API_URL = 'http://localhost:3000/api';

// ===================== ESTADO DO CARRINHO =====================
let carrinho = []; // cada item: { id, nome, preco, quantidade, imagem }

// ===================== DOM ELEMENTOS =====================
const produtosContainer = document.getElementById('produtos-container');
const carrinhoBadge = document.getElementById('carrinho-badge');
const carrinhoBtn = document.getElementById('carrinho-btn');
const carrinhoModal = document.getElementById('carrinho-modal');
const modalClose = document.querySelector('.modal-close');
const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoTotal = document.getElementById('carrinho-total');
const limparCarrinhoBtn = document.getElementById('limpar-carrinho');

// ===================== FUNÇÕES AUXILIARES =====================
function atualizarBadge() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    carrinhoBadge.textContent = totalItens;
}

function calcularTotal() {
    return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}

// ===================== RENDERIZAR PRODUTOS (via API) =====================
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        const produtos = await response.json();

        produtosContainer.innerHTML = ''; // limpa

        produtos.forEach(prod => {
            const card = document.createElement('article');
            card.className = 'card-produto';

            const figure = document.createElement('figure');
            figure.className = 'img-produto';
            const img = document.createElement('img');
            img.src = prod.imagem;
            img.alt = prod.nome;
            figure.appendChild(img);

            const info = document.createElement('div');
            info.className = 'info-produto';

            const nome = document.createElement('h3');
            nome.className = 'nome-produto';
            nome.textContent = prod.nome;

            const preco = document.createElement('div');
            preco.className = 'preco-produto';
            preco.textContent = `R$ ${prod.preco.toFixed(2)}`;

            const btn = document.createElement('button');
            btn.className = 'btn-adicionar';
            btn.textContent = '➕ Adicionar ao Carrinho';
            btn.dataset.id = prod.id;
            btn.addEventListener('click', () => adicionarAoCarrinho(prod.id));

            info.appendChild(nome);
            info.appendChild(preco);
            info.appendChild(btn);

            card.appendChild(figure);
            card.appendChild(info);
            produtosContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        produtosContainer.innerHTML = '<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
    }
}

// ===================== CARRINHO =====================
function adicionarAoCarrinho(id) {
    // Buscar o produto na lista (precisamos dos dados)
    // Como já temos os produtos carregados, podemos buscá-los novamente ou manter um cache.
    // Vamos buscar novamente para evitar duplicação de estado.
    fetch(`${API_URL}/produtos/${id}`)
        .then(res => res.json())
        .then(produto => {
            const existente = carrinho.find(item => item.id === produto.id);
            if (existente) {
                existente.quantidade++;
            } else {
                carrinho.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: 1,
                    imagem: produto.imagem
                });
            }
            atualizarBadge();
            renderizarCarrinho();
        })
        .catch(err => console.error('Erro ao adicionar ao carrinho:', err));
}

function removerItem(id) {
    const index = carrinho.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else {
            carrinho.splice(index, 1);
        }
        atualizarBadge();
        renderizarCarrinho();
    }
}

function excluirItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarBadge();
    renderizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];
    atualizarBadge();
    renderizarCarrinho();
}

function renderizarCarrinho() {
    if (carrinho.length === 0) {
        carrinhoLista.innerHTML = '<p>Seu carrinho está vazio.</p>';
        carrinhoTotal.textContent = 'Total: R$ 0,00';
        return;
    }

    let html = '';
    carrinho.forEach(item => {
        html += `
            <div class="item-carrinho" data-id="${item.id}">
                <div class="info">
                    <h4>${item.nome}</h4>
                    <span>R$ ${item.preco.toFixed(2)}</span>
                </div>
                <div class="quantidade">
                    <button class="btn-diminuir" data-id="${item.id}">−</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-aumentar" data-id="${item.id}">+</button>
                </div>
                <button class="remover" data-id="${item.id}">✕</button>
            </div>
        `;
    });

    carrinhoLista.innerHTML = html;

    // Event listeners para os botões do carrinho
    document.querySelectorAll('.btn-diminuir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removerItem(id);
        });
    });

    document.querySelectorAll('.btn-aumentar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            adicionarAoCarrinho(id);
        });
    });

    document.querySelectorAll('.remover').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            excluirItem(id);
        });
    });

    carrinhoTotal.textContent = `Total: R$ ${calcularTotal().toFixed(2)}`;
}

// ===================== MODAL =====================
function abrirModal() {
    carrinhoModal.classList.add('active');
    renderizarCarrinho();
}

function fecharModal() {
    carrinhoModal.classList.remove('active');
}

carrinhoBtn.addEventListener('click', abrirModal);
modalClose.addEventListener('click', fecharModal);
window.addEventListener('click', (e) => {
    if (e.target === carrinhoModal) {
        fecharModal();
    }
});

limparCarrinhoBtn.addEventListener('click', limparCarrinho);

// ===================== IMAGENS DINÂMICAS (outras seções) =====================
function carregarImagensDinamicas() {
    const imagens = document.querySelectorAll('img[data-src]');
    imagens.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}

// ===================== INICIALIZAÇÃO =====================
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    carregarImagensDinamicas();
    atualizarBadge();
    renderizarCarrinho();
});