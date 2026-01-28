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

const modoAdmin = localStorage.getItem('admin_key') === "2505";

// 1. FUNÇÃO SAIR (Agora sai do admin e fecha/redireciona o app)
function sairGeral() {
    localStorage.removeItem('admin_key');
    alert("Saindo do aplicativo...");
    window.location.href = "https://www.google.com"; // Aqui você define para onde ele vai ao sair
}

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

// 2. FUNÇÃO PUBLICAR
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const profissao = document.getElementById('profissao').value;
    const descricao = document.getElementById('descricao').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const fotoCapa = document.getElementById('fotoCapaInput').files[0];
    const fotoPerfil = document.getElementById('fotoPerfilInput').files[0];

    if (!nome || !profissao || !fotoCapa || !fotoPerfil) {
        alert("Preencha todos os campos e selecione as fotos!");
        return;
    }

    const readerCapa = new FileReader();
    readerCapa.onload = async function() {
        const base64Capa = readerCapa.result;
        const readerPerfil = new FileReader();
        readerPerfil.onload = async function() {
            const base64Perfil = readerPerfil.result;
            
            try {
                await db.collection("profissionais").add({
                    nome, profissao, descricao, whatsapp,
                    fotoCapa: base64Capa,
                    fotoPerfil: base64Perfil,
                    data: new Date()
                });
                alert("✅ PUBLICADO COM SUCESSO!");
                location.reload();
            } catch (e) {
                alert("Erro ao salvar: " + e.message);
            }
        };
        readerPerfil.readAsDataURL(fotoPerfil);
    };
    readerCapa.readAsDataURL(fotoCapa);
}

// 3. FUNÇÃO DENÚNCIA (Ajustada para o seu número final)
function denunciar(nome, id) {
    const seuWhats = "5553999254363"; 
    const mensagem = `🚨 *DENÚNCIA PROF DA HORA*%0A*Profissional:* ${nome}%0A*ID do Post:* ${id}`;
    const link = `https://api.whatsapp.com/send?phone=${seuWhats}&text=${mensagem}`;
    
    if(confirm("Deseja enviar denúncia para o administrador?")) {
        window.open(link, '_blank');
    }
}

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
                        <a href="https://wa.me/55${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg font-bold">WHATSAPP</a>
                        <button onclick="denunciar('${p.nome}', '${id}')" class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px]">DENUNCIAR</button>
                    </div>
                    ${modoAdmin ? `<button onclick="remover('${id}')" class="w-full bg-red-600 text-white py-2 rounded-lg mt-2 font-bold">APAGAR POST</button>` : ""}
                </div>
            </div>`;
    });
}

async function remover(id) {
    if(confirm("Apagar anúncio?")) {
        await db.collection("profissionais").doc(id).delete();
        carregarLista();
    }
}

function filtrar() {
    const termo = document.getElementById('inputPesquisa').value.toLowerCase();
    const cards = document.getElementsByClassName('card-item');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? "block" : "none";
    }
}

carregarLista();
