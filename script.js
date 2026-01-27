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

// 1. GERA OU RECUPERA O ID ÚNICO DESTE CELULAR
let meuID = localStorage.getItem('usuario_id');
if (!meuID) {
    meuID = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('usuario_id', meuID);
}

let capaBase64 = "";
let perfilBase64 = "";

document.getElementById('fotoCapaInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { capaBase64 = event.target.result; };
        reader.readAsDataURL(file);
    }
});

document.getElementById('fotoPerfilInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { perfilBase64 = event.target.result; };
        reader.readAsDataURL(file);
    }
});

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
            fotoCapa: capaBase64,
            fotoPerfil: perfilBase64,
            criadorID: meuID, // SALVA QUEM CRIOU
            data: new Date()
        });
        alert("✅ Cadastrado com sucesso na nuvem!");
        location.reload(); 
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
    }
}

function carregarLista() {
    const lista = document.getElementById('lista-profissionais');
    db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            const id = doc.id;
            
            // VERIFICA SE O CELULAR ATUAL É O DONO DO ANÚNCIO
            const ehDono = (p.criadorID === meuID);

            lista.innerHTML += `
                <div class="card bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
                    <img src="${p.fotoCapa || 'https://via.placeholder.com/400x150?text=Trabalho'}" class="w-full h-32 object-cover">
                    <div class="px-4 pb-4">
                        <div class="flex flex-col items-center">
                            <img src="${p.fotoPerfil || 'https://via.placeholder.com/80?text=Foto'}" class="w-20 h-20 rounded-full border-4 border-white shadow-md -mt-10 object-cover bg-gray-200">
                            <h3 class="font-bold text-lg mt-2">${p.nome}</h3>
                            <p class="text-blue-600 text-sm font-bold">${p.profissao}</p>
                        </div>
                        <p class="text-gray-600 text-xs mt-3 mb-4 text-center italic border-t pt-2">${p.descricao}</p>
                        <div class="flex space-x-2">
                            ${ehDono ? `<button onclick="excluirPerfil('${id}')" class="flex-1 bg-gray-100 text-red-500 py-2 rounded text-xs font-bold">DELETAR</button>` : ''}
                            
                            <a href="https://wa.me/${p.whatsapp}" target="_blank" class="flex-[2] block text-center bg-green-500 text-white py-2 rounded-md font-bold text-sm">WHATSAPP</a>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

async function excluirPerfil(id) {
    if (confirm("Deseja realmente remover seu cadastro?")) {
        try {
            await db.collection("profissionais").doc(id).delete();
            Toastify({ text: "✅ Removido!", duration: 3000, style: { background: "green" } }).showToast();
        } catch (e) { alert(e.message); }
    }
}

function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? "block" : "none";
    }
}

carregarLista();
