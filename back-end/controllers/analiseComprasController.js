const pool = require('../db/firebird');

/**
 * Análise de Compras - Histórico (36 Meses)
 * 
 * Busca TODOS os itens de pedidos de compra (não apenas pendentes),
 * permitindo a construção de um painel de análise histórica com:
 * - Total gasto
 * - Quantidade total adquirida
 * - Evolução mensal
 * - Ranking de fornecedores e itens
 */
exports.getHistoricoCompras = (req, res) => {
    pool.get((err, db) => {
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco', details: err });

        // Query que traz TODOS os itens de pedidos de compra (sem filtro de qtdeaberta)
        const sql = `
            select PEDIDO_COMPRA.CODIGO_PDC, PEDIDO_COMPRA.EMPRESA_PDC, PEDIDO_COMPRA.DTEMISSAO_PDC,
                    PEDIDO_COMPRA.DTPREVENTREGA_PDC, PEDIDO_COMPRA.FORNECEDOR_PDC, PESSOA.RAZAOSOCIAL_PESSOA,
                    PEDIDO_COMPRA_ITEM.ITEM_PDCITEM, ITEM.DESCRICAO_ITEM, PEDIDO_COMPRA_ITEM.VARIACAO_PDCITEM,
                    VARIACAO.DESCRICAO_VARIACAO, PEDIDO_COMPRA_ITEM.COR_PDCITEM, COR.DESCRICAO_COR,
                    PEDIDO_COMPRA_ITEM.ACABAMENTO_PDCITEM, ACABAMENTO.DESCRICAO_ACABAMENTO,
                    PEDIDO_COMPRA_ITEM_DETALHE.QTDEPEDIDO_PDCITEMDET, PEDIDO_COMPRA_ITEM_DETALHE.VLRUNITARIOLIQUIDO_PDCITEMDET
            from PEDIDO_COMPRA
            left join PEDIDO_COMPRA_ITEM on PEDIDO_COMPRA_ITEM.AUTOINCPEDIDO_PDCITEM = PEDIDO_COMPRA.CODIGO_PDC
            left join PEDIDO_COMPRA_ITEM_DETALHE on PEDIDO_COMPRA_ITEM_DETALHE.AUTOINCPDCITEM_PDCITEMDET = PEDIDO_COMPRA_ITEM.AUTOINC_PDCITEM
            left join ITEM on ITEM.CODIGO_ITEM = PEDIDO_COMPRA_ITEM.ITEM_PDCITEM
            left join VARIACAO on VARIACAO.CODIGO_VARIACAO = PEDIDO_COMPRA_ITEM.VARIACAO_PDCITEM
            left join COR on COR.CODIGO_COR = PEDIDO_COMPRA_ITEM.COR_PDCITEM
            left join ACABAMENTO on ACABAMENTO.CODIGO_ACABAMENTO = PEDIDO_COMPRA_ITEM.ACABAMENTO_PDCITEM
            left join PESSOA on PESSOA.CODIGO_PESSOA = PEDIDO_COMPRA.FORNECEDOR_PDC
            where PEDIDO_COMPRA.DTEMISSAO_PDC >= dateadd(month, -36, current_date)
        `;

        db.query(sql, [], (err, result) => {
            db.detach();

            if (err) {
                console.error('Erro na query de histórico:', err);
                return res.status(500).json({ error: 'Erro ao executar a consulta de histórico', details: err });
            }

            console.log(`Histórico carregado: ${result.length} registros encontrados.`);
            res.json({ data: result });
        });
    });
};
