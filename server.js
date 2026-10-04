const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());               
app.use(express.json());       

app.use(express.static(path.join(__dirname, 'SEM_IA')));

const produtos = [
  {
    id: 1,
    nome: 'Banana',
    preco: 5.99,
    imagem: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&auto=format&fit=crop&q=60',
    categoria: 'frutas'
  },
  {
    id: 2,
    nome: 'Maçã',
    preco: 8.90,
    imagem: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?q=80&w=687&auto=format&fit=crop',
    categoria: 'frutas'
  },
  {
    id: 3,
    nome: 'Laranja',
    preco: 4.50,
    imagem: 'https://images.unsplash.com/photo-1609424572698-04d9d2e04954?w=600&auto=format&fit=crop&q=60',
    categoria: 'frutas'
  },
  {
    id: 4,
    nome: 'Alface',
    preco: 3.20,
    imagem: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&auto=format&fit=crop&q=60',
    categoria: 'verduras'
  },
  {
    id: 5,
    nome: 'Tomate',
    preco: 6.75,
    imagem: 'https://images.unsplash.com/photo-1564874997803-e4d589d5fd41?w=600&auto=format&fit=crop&q=60',
    categoria: 'frutas'
  },
  {
    id: 6,
    nome: 'Cenoura',
    preco: 4.30,
    imagem: 'https://images.unsplash.com/photo-1576181256399-834e3b3a49bf?w=600&auto=format&fit=crop&q=60',
    categoria: 'legumes'
  },
  {
    id: 7,
    nome: 'Abacaxi',
    preco: 7.99,
    imagem: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=600&auto=format&fit=crop&q=60',
    categoria: 'frutas'
  },
  {
    id: 8,
    nome: 'Batata Doce',
    preco: 4.90,
    imagem: 'https://images.unsplash.com/photo-1648768940344-9e110879e0c0?w=600&auto=format&fit=crop&q=60',
    categoria: 'legumes'
  }
];

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ erro: 'Produto não encontrado' });
  }
});

app.get('/api/categorias', (req, res) => {
  const categoriasComProdutos = {};

  produtos.forEach(produto => {
    const categoria = produto.categoria;
    if (!categoriasComProdutos[categoria]) {
      categoriasComProdutos[categoria] = [];
    }
    categoriasComProdutos[categoria].push(produto.nome);
  });

  res.json(categoriasComProdutos);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});