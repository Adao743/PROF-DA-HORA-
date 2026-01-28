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

// 1. FUNÇÃO SAIR (Indo direto para o Google como você pediu)
function sairGeral() {
    localStorage.removeItem('admin_key');
    window.location.href = "https://www.google.com";
}

// 2. MOTOR DE REDUZIR FOTO (Para não dar mais o erro de tamanho do print)
async function reduzirFoto(arquivo) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const larguraMax = 600; // Reduz o tamanho da imagem
                const escala = larguraMax / img.width;
                canvas.width = larguraMax;
                canvas.height = img.height * escala;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6)); // Salva com 60% de qualidade
            };
        };
    });
}

// 3. SALVAR CADASTRO (Com as correções de fotos e descrição)
async function salvarCadastro() {
    try {
        const nome = document.getElementById('nome').value;
        const profissao = document.getElementById('profissao').value;
        const descricao = document.getElementById('descricao').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const fCapa = document.getElementById('fotoCapaInput').files[0];
        const fPerfil = document.getElementById('fotoPerfilInput').files[0];

        if (!nome || !fCapa || !fPerfil) {
            alert("Preencha o nome e selecione as fotos!");
            return;
        }

        alert("Processando fotos... Aguarde um instante.");
        
        const base64Capa = await reduzirFoto(fCapa);
        const base64Perfil = await reduzirFoto(fPerfil);

        await db.collection("profissionais").add({
            nome, profissao, descricao, whatsapp,
            fotoCapa: base64Capa,
            fotoPerfil: base64Perfil,
            data: new Date()
        });

        alert("✅ PUBLICADO COM SUCESSO!");
        location.reload();
    } catch (e) {
        alert("Erro técnico: " + e.message);
    }
}

// 4. CARREGAR LISTA (Mantendo o que já funciona)
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

function denunciar(nome, id) {
    const seuWhats = "5553999254363"; 
    const msg = `🚨 DENÚNCIA: ${nome} (ID: ${id})`;
    window.open(`https://api.whatsapp.com/send?phone=${seuWhats}&text=${encodeURIComponent(msg)}`, '_blank');
}

async function remover(id) {
    if(confirm("Apagar anúncio?")) {
        await db.collection("profissionais").doc(id).delete();
        location.reload();
    }
}

function ativarAdmin() {
    if (prompt("Senha:") === "2505") {
        localStorage.setItem('admin_key', "2505");
        location.reload();
    }
}

carregarLista();
