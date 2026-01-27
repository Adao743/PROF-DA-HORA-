// Memória do App
let profissionais = [];

// Função para excluir
function excluirProfissional(index) {
    if (confirm("Deseja mesmo excluir este perfil?")) {
        profissionais.splice(index, 1);
        renderizarLista();
    }
}

// Função para mostrar na tela
function renderizarLista() {
    const lista = document.getElementById('lista-perfis');
    if (lista) {
        lista.innerHTML = '';
        profissionais.forEach((prof, index) => {
            lista.innerHTML += `
                <div class="bg-white p-5 rounded-xl shadow-md border-t-4 border-blue-500 mb-4">
                    <h2 class="text-xl font-bold text-gray-800">${prof.nome}</h2>
                    <p class="text-blue-600 font-semibold text-sm">${prof.profissao}</p>
                    <div class="mt-5 flex gap-3">
                        <button onclick="alert('Editar em breve')" class="flex-1 bg-gray-100 py-2 rounded-lg border">Editar</button>
                        <button onclick="excluirProfissional(${index})" class="flex-1 bg-red-50 text-red-600 py-2 rounded-lg border border-red-200">Excluir</button>
                    </div>
                </div>`;
        });
    }
}

// Inicia com um exemplo
window.onload = () => {
    profissionais.push({nome: "Exemplo: João Silva", profissao: "Eletricista"});
    renderizarLista();
};
