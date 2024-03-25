function inserirNovoProduto(event){
    event.preventDefault();

    let nome_produto = $('#nome').val();
    let descricao_produto = $('#descricao').val();
    let valor_produto = removerPontuacao($('#valor').val());
    let disponibilidade_venda = $('input[name="disponivel"]:checked').val();
    
    const url = "/produtos";
    const dataToSave = {
        nome_produto: nome_produto,
        descricao_produto: descricao_produto,
        valor_produto: valor_produto,
        disponibilidade_venda: disponibilidade_venda
    };
    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataToSave),
        success: function(data) {
          console.log('Dados salvos com sucesso:', data);
          window.location.href = "produtos.html";
        },
        error: function(xhr, status, error) {
            alert("Todos os campos precisão estar preenchidos")
        }
      });
}

function carregarProdutos(){
    $.ajax({
        url: '/produtos',
        method: 'GET',
        success: function(produtos) {
            console.log(produtos)
            const tabelaProdutos = $('#tabela-produtos');
            produtos.forEach(function(produto) {
                console.log(produto)
                const tr = $('<tr>');
                tr.append($('<td>').text(produto.nome));
                tr.append($('<td>').text(produto.descricao));
                tr.append($('<td>').text(inteiroToDinheiro(produto.valor)));
                tr.append($('<td>').text(produto.disponivel ? 'Sim' : 'Não'));
                tabelaProdutos.append(tr)
            });
        },
        error: function(xhr, status, error) {
          console.error('Erro:', error);
        }
      });
}

function formatarValor(valor) {
    valor = valor.replace(/[^\d.]/g, '');
    let partes = valor.split('.');
    partes[0] = partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    if (partes.length > 1) {
      partes[1] = partes[1].padEnd(2, '0');
    } else {
      partes.push('00'); 
    }
    valorFormatado = partes.join(',');
    document.getElementById('valor').value = valorFormatado
}

function removerPontuacao(valor) {

    valor = valor.toString().replace(/[^\d,]/g, '');
    valor = valor.replace(',', '.'); 
    valor = parseFloat(valor);
    console.log(valor);
    return valor
}
 function inteiroToDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function deleteProdutos(){
    $.ajax({
        url: '/deletar_produtos',
        method: 'GET',
        success: function(produtos) {
            console.log("SUCESSO")
            carregarProdutos()
        },
        error: function(xhr, status, error) {
          console.error('Erro:', error);
        }
      });
}
