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

// Converte a foto para texto (Base64) para salvar no Google
document.getElementById('fotoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fotoBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Salva no Banco de Dados
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const prof = document.getElementById('profissao').value;
    const desc = document.getElementById('descricao').value;
    const whats = document.getElementById('whatsapp').value;

    if (!nome || !prof || !whats) {
        alert("Preencha Nome, Profissão e WhatsApp!");
        return;
    }

    try {
        await db.collection("profissionais").add({
            nome: nome,
            profissao: prof,
            descricao: desc,
            whatsapp: whats,
            foto: fotoBase64, // Agora a foto vai certinha
            data: new Date()
        });
        alert("✅ Publicado com sucesso!");
        location.reload(); 
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
    }
}

// Carrega a lista e permite a Pesquisa
function carregarLista() {
    const lista = document.getElementById('lista-profissionais');
    db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            lista.innerHTML += `
                <div class="card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
                    <img src="${p.foto || 'https://via.placeholder.com/400x150?text=Sem+Foto'}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-xl text-gray-800">${p.nome}</h3>
                        <p class="text-blue-600 font-bold mb-2">${p.profissao}</p>
                        <p class="text-gray-600 text-sm mb-4">${p.descricao}</p>
                        <a href="https://wa.me/${p.whatsapp}" target="_blank" class="block text-center bg-green-500 text-white py-2 rounded-md font-bold">Chamar no WhatsApp</a>
                    </div>
                </div>
            `;
        });
    });
}

// Função de Pesquisa
function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card');

    for (let card of cards) {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(termo) ? "block" : "none";
    }
}

carregarLista();
