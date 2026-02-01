const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota de Teste (Raiz)
app.get('/', (req, res) => {
  res.send('API da FC Motos está rodando! 🏍️');
});

// =====================================================
// NOVA ROTA: PEGAR TODOS OS CANDIDATOS (PARA O DASHBOARD)
// =====================================================
app.get('/api/candidatos', async (req, res) => {
  try {
    const listaCandidatos = await prisma.candidato.findMany({
      orderBy: {
        id: 'desc' // Mostra os cadastros mais recentes primeiro
      }
    });
    res.json(listaCandidatos);
  } catch (error) {
    console.error("Erro ao buscar lista:", error);
    res.status(500).json({ error: 'Erro ao buscar candidatos.' });
  }
});

// =====================================================
// ROTA ANTIGA: CRIAR CANDIDATO (PARA O FORMULÁRIO)
// =====================================================
app.post('/api/candidatos', async (req, res) => {
  try {
    const dados = req.body;

    // 1. Validação Manual de Campos Obrigatórios
    const camposObrigatorios = ['nome', 'cidade_bairro', 'idade', 'valor_investimento', 'restricao_cpf', 'disponivel_contrato'];
    const camposFaltantes = camposObrigatorios.filter(campo => !dados[campo]);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({ 
        error: `Faltam dados obrigatórios: ${camposFaltantes.join(', ')}` 
      });
    }

    // 2. Salva no Banco
    const novoCandidato = await prisma.candidato.create({
      data: {
        nome: dados.nome,
        cidade_bairro: dados.cidade_bairro,
        idade: dados.idade,
        instagram: dados.instagram || null, // Garante nulo se vier vazio
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

    console.log("Novo cadastro:", novoCandidato.nome);
    res.status(201).json({ message: 'Sucesso!', id: novoCandidato.id });

  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: 'Erro interno ao salvar.' });
  }
});

// =====================================================
// NOVA ROTA: DELETAR UM CANDIDATO PELO ID
// =====================================================
app.delete('/api/candidatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Converte o ID para número e manda o Prisma deletar
    await prisma.candidato.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: 'Erro ao deletar.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});