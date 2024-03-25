const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('database.db', err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite3');
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM produtos ORDER BY valor ASC', (err, rows) => {
    if (err) {
        console.error('Erro ao buscar produtos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
        res.json(rows);
    }
    });
});

app.post('/produtos', (req, res) => {
    console.log(req.body)
    const {
        nome_produto,
        descricao_produto,
        valor_produto,
        disponibilidade_venda
    } = req.body;
    let disponibilidade = (disponibilidade_venda === "sim") ? 1 : 0;

    if (!nome_produto || !descricao_produto || !valor_produto) {
        res.status(400).json({ error: 'Nome e email são obrigatórios' });
        console.log("Algum campo faltando")
        return;
    }

    db.run('INSERT INTO produtos (nome, descricao, valor, disponivel) VALUES (?, ?, ?, ?)', [nome_produto, descricao_produto, valor_produto, disponibilidade], function(err) {
        if (err) {
        console.error('Erro ao adicionar usuário:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.status(201).json({ id: this.lastID, nome_produto});
        }
    });
});

app.get('/deletar_produtos', (req, res) => {
    db.run('DELETE FROM produtos', (err, rows) => {
    if (err) {
        console.error('Erro ao buscar produtos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
        console.log("Produtos deletados")
    }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});