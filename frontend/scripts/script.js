const API_URL = "http://localhost:3041";

const tituloFormulario = document.getElementById("tituloFormulario");
const formProduto = document.getElementById("formProduto");
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const botaoCancelar = document.getElementById("botaoCancelar");
const botaoSalvar = document.getElementById("botaoSalvar");
const mensagem = document.getElementById("mensagem");
const idBusca = document.getElementById("idBusca");
const botaoBuscar = document.getElementById("botaoBuscar");
const botaolistar = document.getElementById("botaoListar");
const resultadoBusca = document.getElementById("resultadosBusca");
const botaoAtualizarLista = document.getElementById("botaoAtualizarLista");
const listaProdutos = document.getElementById("listaProdutos");

function mostarMensagem(texto, ehErro = false){
    mensagem.textContent = texto;
    mensagem.className = ehErro ? `erro` : `sucesso`;
}

async function listarProdutos(){
    try {
        const resposta = await fetch(`${API_URL}/produtos`);
         if (!resposta.ok) {
            throw new Error("Erro ao listar produtos");
         }
         const produtos = await resposta.json();
         listaProdutos.innerHTML = "";

            if(produtos.length === 0){
                listaProdutos.innerHTML = `
                <tr>
                    <td colspan ="5">Nenhum produto encontrado. </td>
                </tr>
                `;
                return;
            };
            
            produtos.forEach((produto) =>{
                listaProdutos.innerHTML += `
                    <tr>
                        <td>${produto.id}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.descricao}</td>
                        <td>${Number(produto.preco).toFixed(2)}</td>
                        <td>
                            <button onclick = "prepararEdicao(${produto.id})">
                                Editar
                              </button>
                            <button onclick = "excluirProduto(${produto.id})">
                                Excluir
                              </button>
                        </td>
                    </tr>
                `;
            })
    }catch (error){     
        mostarMensagem(error.message, true);            
    }
    
};

async function buscarProdutoId(){
    try {
        const id = idBusca.value;
        const resposta = await fecth(`${API_URL}/produtod/${id}`);
            if (!resposta.ok){
                throw new Error("Produto não encontrado");
            }
            const produto = await resposta.json();
            buscarProdutoId.innerHTML = `
                <tr>
                    <td>${produto.id}</td>
                </tr>    
            `

    }catch (error){
        mostarMensagem(error.message, true);
    }

};

listarProdutos()