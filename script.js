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

// 1. IDENTIFICAÇÃO ÚNICA DO CELULAR
let meuID = localStorage.getItem('usuario_id');
if (!meuID) {
    meuID = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('usuario_id', meuID);
}

let capaBase64 = "";
let perfilBase64 = "";

// 2. FUNÇÃO PARA DIMINUIR O TAMANHO DAS FOTOS
function redimensionarImagem(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const max_size = 600; // Reduzi um pouco mais para garantir velocidade

            if (width > height) {
                if (width > max_size) { height *= max_size / width; width = max_size; }
            } else {
                if (height > max_size) { width *= max_size / height; height = max_size; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL("image/jpeg", 0.6)); // Qualidade 60% para ser bem leve
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// 3. CAPTURA DE FOTOS
document.getElementById('fotoCapaInput').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        redimensionarImagem(e.target.files[0], (base64) => { capaBase64 = base64; });
    }
});

document.getElementById('fotoPerfilInput').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        redimensionarImagem(e.target.files[0], (base64) => { perfilBase64 = base64; });
    }
});

// 4. SALVAR NO FIREBASE (CORRIGIDO PARA EVITAR ERROS)
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const prof = document.getElementById('profissao').value;
    const desc = document.getElementById('descricao').value;
    const whats = document.getElementById('whatsapp').value;
    const btn = document.querySelector("button[onclick='salvarCadastro()']");

    if (!nome || !prof || !whats) {
        alert("⚠️ Preencha nome, profissão e WhatsApp!");
        return;
    }

    // Desativa o botão para evitar erros durante o envio
    if(btn) {
        btn.disabled = true;
        btn.innerText = "CARREGANDO...";
    }

    try {
        await db.collection("profissionais").add({
            nome, 
            profissao: prof, 
            descricao: desc, 
            whatsapp: whats,
            fotoCapa: capaBase64,
            fotoPerfil: perfilBase64,
            criadorID: meuID, 
            data: new Date()
        });
        alert("✅ Publicado com sucesso!");
        location.reload(); 
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
        if(btn) {
            btn.disabled = false;
            btn.innerText = "PUBLICAR";
        }
    }
}

// 5. CARREGAR LISTA
function carregarLista() {
    const lista = document.getElementById('lista-profissionais');
    db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            const id = doc.id;
            const ehDono = (p.criadorID === meuID);

            lista.innerHTML += `
                <div class="card-item bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
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

// 6. EXCLUIR
async function excluirPerfil(id) {
    if (confirm("Deseja realmente remover seu cadastro?")) {
        try {
            await db.collection("profissionais").doc(id).delete();
            alert("✅ Removido!");
        } catch (e) { alert(e.message); }
    }
}

// 7. FILTRAR BUSCA
function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card-item');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? "block" : "none";
    }
}

carregarLista();
