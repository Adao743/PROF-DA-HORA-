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

// MANTIDO: Sistema de Admin que você já conhece
const modoAdmin = localStorage.getItem('admin_key') === "2505";

// MANTIDO: Sua função de denúncia
function denunciar(nome, id) {
    window.open(`https://api.whatsapp.com/send?phone=5553999254363&text=Denuncia:${nome}`, '_blank');
}

// CORREÇÃO: Função Sair para o seu novo botão
function sairGeral() {
    localStorage.removeItem('admin_key');
    window.location.replace("https://www.google.com");
}

// NOVO: Redutor de foto (Necessário para evitar o erro de 1.1MB que você viu)
async function reduzirFoto(arquivo) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const larguraMax = 600;
                const escala = larguraMax / img.width;
                canvas.width = larguraMax;
                canvas.height = img.height * escala;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
        };
    });
}

// MANTIDO: Salvar com o seu sistema de Alertas
async function salvarCadastro() {
    try {
        const nome = document.getElementById('nome').value;
        const profissao = document.getElementById('profissao').value;
        const fCapa = document.getElementById('fotoCapaInput').files[0];
        const fPerfil = document.getElementById('fotoPerfilInput').files[0];

        if (!nome || !fCapa || !fPerfil) {
            alert("Preencha os campos obrigatórios e fotos!");
            return;
        }

        alert("Reduzindo fotos para garantir a publicação...");
        const base64Capa = await reduzirFoto(fCapa);
        const base64Perfil = await reduzirFoto(fPerfil);

        await db.collection("profissionais").add({
            nome, 
            profissao, 
            descricao: document.getElementById('descricao').value,
            whatsapp: document.getElementById('whatsapp').value,
            fotoCapa: base64Capa,
            fotoPerfil: base64Perfil,
            data: new Date()
        });

        alert("✅ PUBLICADO COM SUCESSO!");
      toggleForm();  location.reload();
    } catch (e) {
        alert("Erro ao salvar: " + e.message);
    }
}

// MANTIDO: Carregar Lista (Exatamente como o seu que funciona)
async function carregarLista() {
    const querySnapshot = await db.collection("profissionais").orderBy("data", "desc").get();
    const lista = document.getElementById('lista-profissionais');
    if(!lista) return; 
    
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        lista.innerHTML += `
            <div class="card-item bg-white rounded-xl shadow-lg overflow-hidden mb-4 p-3 relative">
                <img src="${p.fotoCapa}" class="w-full h-32 object-cover rounded-lg">
                
                <div class="flex flex-col items-center mt-[-40px]">
                    <img src="${p.fotoPerfil}" class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white shadow-md">
                    
                    <h2 class="text-xl font-bold mt-2 text-center uppercase text-gray-800">${p.nome}</h2>
                    <p class="text-blue-600 font-bold">${p.profissao}</p>
                    <p class="text-gray-600 text-sm text-center mt-2 px-2 line-clamp-2">${p.descricao}</p>

                    <div class="flex items-center justify-center gap-4 mt-3 mb-1">
                        <div onclick="curtir('${id}')" class="flex items-center gap-1 cursor-pointer hover:scale-110 transition active:scale-90">
                            <svg class="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span class="font-black text-lg text-gray-700">${p.likes || 0}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 mt-2 w-full">
                        <a href="https://wa.me/55${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-black shadow-sm">WHATSAPP</a>
                        <button onclick="denunciar('${p.nome}', '${id}')" class="bg-gray-100 text-gray-400 px-3 py-1 rounded-xl text-[10px] font-bold uppercase">Denunciar</button>
                    </div>

                    ${modoAdmin ? `<button onclick="remover('${id}')" class="w-full bg-red-600 text-white py-3 rounded-xl mt-2 font-black shadow-md uppercase">Apagar Post</button>` : ""}
                </div>
            </div>`;
            </div>`;
    });
}

async function remover(id) {
    if(confirm("Apagar permanentemente?")) {
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
// O interruptor: liga e desliga o formulário
function toggleForm() {
    const form = document.getElementById('form-cadastro');
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}
function filtrarProfissionais() {
    // Pega o que o usuário digitou e transforma em minúsculo
    let input = document.getElementById('campo-pesquisa').value.toLowerCase();
    // Pega todos os cards de profissionais que estão na tela
    let lista = document.getElementById('lista-profissionais');
    let cards = lista.getElementsByClassName('bg-white'); // Pega as divs dos cards

    for (let i = 0; i < cards.length; i++) {
        // Pega o texto dentro do card (nome e profissão)
        let conteudoCard = cards[i].innerText.toLowerCase();
        
        // Se o texto digitado estiver dentro do card, ele mostra, se não, esconde
        if (conteudoCard.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
