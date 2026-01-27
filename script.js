// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBm9dy9MXr9Lg3lNqLX5wzMYuy5i_Q8Hdc",
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.firebasestorage.app",
  messagingSenderId: "124661519863",
  appId: "1:124661519863:web:600d142f499a0d5c43d810",
  measurementId: "G-37CWFVZQ9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let fotoBase64 = "";

// Converte a foto escolhida
document.getElementById('fotoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { fotoBase64 = event.target.result; };
        reader.readAsDataURL(file);
    }
});

// Salva no Banco de Dados com a sua mensagem personalizada
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const prof = document.getElementById('profissao').value;
    const desc = document.getElementById('descricao').value;
    const whats = document.getElementById('whatsapp').value;

    if (!nome || !prof || !whats) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    try {
        await db.collection("profissionais").add({
            nome, profissao: prof, descricao: desc, whatsapp: whats,
            foto: fotoBase64,
            data: new Date()
        });
        alert("✅ Cadastrado com sucesso na nuvem!");
        location.reload(); 
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
    }
}

// Carrega a lista com botões de Editar e Deletar
function carregarLista() {
    const lista = document.getElementById('lista-profissionais');
    db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            const id = doc.id;
            lista.innerHTML += `
                <div class="card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
                    <img src="${p.foto || 'https://via.placeholder.com/400x150?text=Sem+Foto'}" class="w-full h-40 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-lg">${p.nome}</h3>
                        <p class="text-blue-600 text-sm mb-2">${p.profissao}</p>
                        <p class="text-gray-600 text-xs mb-4">${p.descricao}</p>
                        
                        <div class="flex space-x-2 mb-3">
                            <button onclick="excluirPerfil('${id}')" class="flex-1 bg-gray-200 text-red-600 py-1 rounded text-xs font-bold">DELETAR</button>
                        </div>

                        <a href="https://wa.me/${p.whatsapp}" target="_blank" class="block text-center bg-green-500 text-white py-2 rounded-md font-bold text-sm">WHATSAPP</a>
                    </div>
                </div>
            `;
        });
    });
}

// Função para Deletar
async function excluirPerfil(id) {
    if (confirm("Tem certeza que deseja apagar este cadastro das nuvens?")) {
        try {
            await db.collection("profissionais").doc(id).delete();
            alert("Removido com sucesso!");
        } catch (e) {
            alert("Erro ao excluir: " + e.message);
        }
    }
}

// Função de Pesquisa
function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? "block" : "none";
    }
}

carregarLista();
