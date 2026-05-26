const pool = require('../db/firebird');

/**
 * Busca de Pedidos de Compra Pendentes
 * 
 * Esta função executa uma query avançada no banco de dados Firebird,
 * realizando múltiplos JOINs para trazer informações ricas sobre
 * o pedido, o fornecedor, o item e a quantidade ainda em aberto.
 */
exports.getComprasPendentes = (req, res) => {
    // Solicita uma conexão ao pool
    pool.get((err, db) => {
        // Tratamento de erro na conexão com o banco
        if (err) return res.status(500).json({ error: 'Erro de conexão com o banco', details: err });

        // Query SQL para trazer apenas itens de pedidos de compra onde qtdeaberta > 0
        const sql = `
            select PEDIDO_COMPRA.CODIGO_PDC, PEDIDO_COMPRA.EMPRESA_PDC, PEDIDO_COMPRA.DTEMISSAO_PDC,
                    PEDIDO_COMPRA.DTPREVENTREGA_PDC, PEDIDO_COMPRA.FORNECEDOR_PDC, PESSOA.RAZAOSOCIAL_PESSOA,
                    PEDIDO_COMPRA_ITEM.ITEM_PDCITEM, ITEM.DESCRICAO_ITEM, PEDIDO_COMPRA_ITEM.VARIACAO_PDCITEM,
                    VARIACAO.DESCRICAO_VARIACAO, PEDIDO_COMPRA_ITEM.COR_PDCITEM, COR.DESCRICAO_COR,
                    PEDIDO_COMPRA_ITEM.ACABAMENTO_PDCITEM, ACABAMENTO.DESCRICAO_ACABAMENTO,
                    PEDIDO_COMPRA_ITEM_DETALHE.QTDEABERTA_PDCITEMDET, PEDIDO_COMPRA_ITEM_DETALHE.VLRUNITARIOLIQUIDO_PDCITEMDET
            from PEDIDO_COMPRA
            left join PEDIDO_COMPRA_ITEM on PEDIDO_COMPRA_ITEM.AUTOINCPEDIDO_PDCITEM = PEDIDO_COMPRA.CODIGO_PDC
            left join PEDIDO_COMPRA_ITEM_DETALHE on PEDIDO_COMPRA_ITEM_DETALHE.AUTOINCPDCITEM_PDCITEMDET = PEDIDO_COMPRA_ITEM.AUTOINC_PDCITEM
            left join ITEM on ITEM.CODIGO_ITEM = PEDIDO_COMPRA_ITEM.ITEM_PDCITEM
            left join VARIACAO on VARIACAO.CODIGO_VARIACAO = PEDIDO_COMPRA_ITEM.VARIACAO_PDCITEM
            left join COR on COR.CODIGO_COR = PEDIDO_COMPRA_ITEM.COR_PDCITEM
            left join ACABAMENTO on ACABAMENTO.CODIGO_ACABAMENTO = PEDIDO_COMPRA_ITEM.ACABAMENTO_PDCITEM
            left join PESSOA on PESSOA.CODIGO_PESSOA = PEDIDO_COMPRA.FORNECEDOR_PDC
            where PEDIDO_COMPRA_ITEM_DETALHE.QTDEABERTA_PDCITEMDET > 0
        `;

        // Execução da query
        db.query(sql, [], (err, result) => {
            // É essencial liberar a conexão de volta ao pool após o uso
            db.detach();

            // Tratamento de erro na execução do SQL
            if (err) return res.status(500).json({ error: 'Erro ao executar a consulta', details: err });

            // Retorna os dados em formato JSON para o front-end
            res.json({ data: result });
        });
    });
};
