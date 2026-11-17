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
const resultadoBusca = document.getElementById("resultadoBusca");
const botaoAtualizarLista = document.getElementById("botaoAtualizarLista");
const listaProdutos = document.getElementById("listaProdutos");

let idProdutoEditando = null;

function mostarMensagem(texto, ehErro = false){
    mensagem.textContent = texto;
    mensagem.className = ehErro ? `erro` : `sucesso`;
}

function limparFormulario(){
    formProduto.reset();
    idProdutoEditando = null;
    tituloFormulario.textContent = "Cadastrar Produto";
    botaoSalvar.textContent = "Cadastrar";
};

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

async function buscarProdutoId(id){
   
    if(!id) {
        resultadoBusca.textContent = "Informe um ID";
    };

    try {
        const resposta = await fetch(`${API_URL}/produtos/${id}`);
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar produto');
        };

        const dados = await resposta.json();
        const produto = dados[0];

        if (!produto) {
            resultadoBusca.textContent = "Produto não encontrado"
            return;
        };

        resultadoBusca.innerHTML = `
            <p><strong>ID:</strong> ${produto.id}</p>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Preço:</strong> ${produto.preco}</p>
        `;
    } catch(erro) {
        resultadoBusca.textContent = erro.message;
    };
};

async function criarProduto(dadosProduto){
    try{
       const resposta = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)      
        });

        if(!resposta.ok) {
            throw new Error("Erro ao criar produto");
        };

        const resultado = await resposta.json();
        return resultado;

    }catch (error){
        mostarMensagem(error.message, true);
    }
};

async function eitarProduto(id, dadosProduto){
    try{
        const resposta = await fetch(`${API_URL}/produtos/${id}`,{
            method: `PUT`, 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)    
        });
        if(!resposta.ok) {
            throw new Error("Erro ao editar produto");
        };

        const resultado = await resposta.json();
        return resultado;


    }catch(error){
        mostarMensagem(error.message, true);
    }
};

async function excluirProduto(id){
    try{
        const resposta = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });

        if(!resposta.ok) {
            throw new Error("Erro ao excluir produto");
        }

        mostarMensagem("Produto excluído com sucesso!");
        listarProdutos();
    }catch (error){
        mostarMensagem(error.message, true);
    }
};

async function prepararEdicao(id){
    try{
        const resposta = await fetch(`${API_URL}/produtos/${id}`);

        if(!resposta.ok){
            throw new Error("Erro ao buscar Produto");
        };

        const dados = await resposta.json();
        const produto = dados[0]; 
    
         idProdutoEditando = produto.id;

        nome.value = produto.nome;
        descricao.value = produto.descricao;
        preco.value = produto.preco;

        tituloFormulario.textContent = "Editar Produto";
        botaoSalvar.textContent = "Salvar Alterações";

        window.scrollTo(0, 0);

    }catch (error){
        mostarMensagem(error.message, true);
    };
    


}

botaoBuscar.addEventListener("click", async () => {
    const id = idBusca.value;
    buscarProdutoId(id);
})
formProduto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosProduto = {
        nome: nome.value,
        descricao: descricao.value,
        preco: preco.value
    };

    try{
        if(idProdutoEditando === null){
            await criarProduto(dadosProduto); 
            mostarMensagem("Produto cadastrado com sucesso!");
           
        } else {
            await eitarProduto(idProdutoEditando, dadosProduto);
            mostarMensagem("Produto editado com sucesso!");
        }

        limparFormulario();
        listarProdutos();
        
    }catch (erro){
        mostarMensagem(erro.message, true);
    }
});

 listarProdutos()