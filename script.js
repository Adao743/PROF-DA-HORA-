// 1. CONFIGURAÇÃO (Sempre no topo)
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

// 2. CONTROLE DE ADMIN
const modoAdmin = localStorage.getItem('admin_key') === "2505";

function ativarAdmin() {
    const senha = prompt("Digite a senha mestra:");
    if (senha === "2505") {
        localStorage.setItem('admin_key', "2505");
        alert("🔓 Modo Administrador Ativado!");
        location.reload();
    } else {
        alert("❌ Senha incorreta!");
    }
}

function sairAdmin() {
    localStorage.removeItem('admin_key');
    alert("Saída realizada!");
    location.reload();
}

// 3. FUNÇÃO DE DENÚNCIA (Importante estar separada)
function denunciar(nome, id) {
    const seuWhats = "5553991244587"; 
    const msg = encodeURIComponent(`🚨 DENÚNCIA\nNome: ${nome}\nID: ${id}`);
    window.open(`https://wa.me/${seuWhats}?text=${msg}`);
}

// 4. CARREGAR A LISTA (Onde os botões são criados)
async function carregarLista() {
    const querySnapshot = await db.collection("profissionais").orderBy("data", "desc").get();
    const lista = document.getElementById('lista-profissionais');
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        lista.innerHTML += `
            <div class="card-item bg-white rounded-xl shadow-lg overflow-hidden mb-4 p-3">
                <img src="${p.fotoCapa}" class="w-full h-32 object-cover rounded-lg">
                <div class="flex flex-col items-center mt-[-40px]">
                    <img src="${p.fotoPerfil}" class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white">
                    <h2 class="text-xl font-bold mt-2">${p.nome}</h2>
                    <p class="text-blue-600 font-bold">${p.profissao}</p>
                    <p class="text-gray-600 text-sm text-center mt-2">${p.descricao}</p>
                    
                    <div class="flex gap-2 mt-4 w-full">
                        <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg font-bold">WHATSAPP</a>
                        
                        <button onclick="denunciar('${p.nome}', '${id}')" class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px]">DENUNCIAR</button>
                    </div>

                    ${modoAdmin ? `<button onclick="remover('${id}')" class="w-full bg-red-600 text-white py-2 rounded-lg mt-2 font-bold">APAGAR POST</button>` : ""}
                </div>
            </div>`;
    });
}

// 5. OUTRAS FUNÇÕES (Remover, Salvar, Filtrar)
async function remover(id) {
    if(confirm("Apagar anúncio?")) {
        await db.collection("profissionais").doc(id).delete();
        carregarLista();
    }
}

async function salvarCadastro() {
    // ... (mantenha sua função de salvar aqui)
}

function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card-item');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? "block" : "none";
    }
}

// Inicia tudo
carregarLista();
