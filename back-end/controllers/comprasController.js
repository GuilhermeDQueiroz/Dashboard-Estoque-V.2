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
            select
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
                pedido_compra_item_detalhe.qtdeaberta_pdcitemdet,
                pedido_compra_item_detalhe.vlrunitarioliquido_pdcitemdet
            from pedido_compra
            left join pedido_compra_item
                on pedido_compra_item.autoincpedido_pdcitem = pedido_compra.codigo_pdc
            left join pedido_compra_item_detalhe
                on pedido_compra_item_detalhe.autoincpdcitem_pdcitemdet = pedido_compra_item.autoinc_pdcitem
            left join item
                on item.codigo_item = pedido_compra_item.item_pdcitem
            left join variacao
                on variacao.codigo_variacao = pedido_compra_item.variacao_pdcitem
            left join cor
                on cor.codigo_cor = pedido_compra_item.cor_pdcitem
            left join acabamento
                on acabamento.codigo_acabamento = pedido_compra_item.acabamento_pdcitem
            left join pessoa
                on pessoa.codigo_pessoa = pedido_compra.fornecedor_pdc
            where pedido_compra_item_detalhe.qtdeaberta_pdcitemdet > 0
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
