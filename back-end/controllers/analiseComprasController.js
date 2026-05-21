const pool = require('../db/firebird');

/**
 * Análise de Compras - Histórico (12 Meses)
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
            SELECT
                pedido_compra.codigo_pdc,
                pedido_compra.empresa_pdc,
                pedido_compra.dtemissao_pdc,
                pedido_compra.dtpreventrega_pdc,
                pedido_compra.fornecedor_pdc,
                pessoa.razaosocial_pessoa,
                pedido_compra_item.item_pdcitem,
                item.descricao_item,
                pedido_compra_item.variacao_pdcitem,
                variacao.descricao_variacao,
                pedido_compra_item.cor_pdcitem,
                cor.descricao_cor,
                pedido_compra_item.acabamento_pdcitem,
                acabamento.descricao_acabamento,
                pedido_compra_item_detalhe.qtdepedido_pdcitemdet,
                pedido_compra_item_detalhe.vlrunitarioliquido_pdcitemdet
            FROM pedido_compra
            LEFT JOIN pedido_compra_item
                ON pedido_compra_item.autoincpedido_pdcitem = pedido_compra.codigo_pdc
            LEFT JOIN pedido_compra_item_detalhe
                ON pedido_compra_item_detalhe.autoincpdcitem_pdcitemdet = pedido_compra_item.autoinc_pdcitem
            LEFT JOIN item
                ON item.codigo_item = pedido_compra_item.item_pdcitem
            LEFT JOIN variacao
                ON variacao.codigo_variacao = pedido_compra_item.variacao_pdcitem
            LEFT JOIN cor
                ON cor.codigo_cor = pedido_compra_item.cor_pdcitem
            LEFT JOIN acabamento
                ON acabamento.codigo_acabamento = pedido_compra_item.acabamento_pdcitem
            LEFT JOIN pessoa
                ON pessoa.codigo_pessoa = pedido_compra.fornecedor_pdc
            WHERE pedido_compra.dtemissao_pdc >= DATEADD(MONTH, -36, CURRENT_DATE)
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
