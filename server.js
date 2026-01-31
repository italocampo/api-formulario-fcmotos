const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.use(cors()); // Permite que o Frontend converse com o Backend
app.use(bodyParser.json());

// Rota de Teste (Para saber se o servidor está on)
app.get('/', (req, res) => {
  res.send('API da FC Motos está rodando! 🏍️');
});

// Rota para Salvar o Formulário
app.post('/api/candidatos', async (req, res) => {
  try {
    const dados = req.body;

    // Salva no Banco de Dados usando Prisma
    const novoCandidato = await prisma.candidato.create({
      data: {
        nome: dados.nome,
        cidade_bairro: dados.cidade_bairro,
        idade: dados.idade,
        instagram: dados.instagram,
        tem_outros_negocios: dados.tem_outros_negocios,
        quais_negocios: dados.quais_negocios,
        atuacao_negocio: dados.atuacao_negocio,
        valor_investimento: dados.valor_investimento,
        restricao_cpf: dados.restricao_cpf,
        disponivel_contrato: dados.disponivel_contrato,
        tem_experiencia: dados.tem_experiencia,
        descricao_experiencia: dados.descricao_experiencia,
        motivacao: dados.motivacao,
        perfil_socio: dados.perfil_socio,
        aceita_processos: dados.aceita_processos
      }
    });

    console.log("Novo cadastro recebido:", novoCandidato.nome);
    res.status(201).json({ message: 'Cadastro realizado com sucesso!', id: novoCandidato.id });

  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: 'Erro ao salvar os dados. Tente novamente.' });
  }
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});