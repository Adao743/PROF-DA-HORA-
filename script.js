// Configurações do Firebase (Mantenha as suas aqui)
const firebaseConfig = {
    // COPIE E COLE AQUI SUAS CHAVES DO FIREBASE SE ELAS NÃO ESTIVEREM NO INDEX
};

// Inicializar Firebase apenas se ainda não foi inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// --- FUNÇÃO: CARREGAR PROFISSIONAIS ---
function carregarProfissionais() {
    const lista = document.getElementById('lista-profissionais');
    const isAdmin = localStorage.getItem('admin_key') === '2505';

    db.collection("profissionais").orderBy("nome").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            const id = doc.id;

            lista.innerHTML += `
                <div class="bg-white rounded-xl shadow-lg mb-6 p-4 border border-gray-100 relative">
                    
                    ${isAdmin ? `
                        <button onclick="removerProfissional('${id}')" 
                                class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
                            EXCLUIR
                        </button>
                    ` : ''}

                    <img src="${p.fotoCapa || 'https://via.placeholder.com/400x150'}" class="w-full h-32 object-cover rounded-lg">
                    
                    <div class="flex flex-col items-center mt-[-40px]">
                        <img src="${p.fotoPerfil || 'https://via.placeholder.com/100'}" 
                             class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white shadow-md">
                        <h2 class="text-xl font-bold mt-2 text-gray-800">${p.nome}</h2>
                        <p class="text-blue-600 font-bold">${p.profissao}</p>
                    </div>

                    <p class="text-gray-600 text-sm mt-3 text-center px-4">${p.descricao}</p>

                    <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                        <div class="flex items-center space-x-2">
                            <button onclick="curtir('${id}', ${p.curtidas || 0})" class="flex items-center space-x-1 text-gray-500">
                                <span>❤️</span>
                                <span class="font-bold text-sm">${p.curtidas || 0}</span>
                            </button>
                        </div>
                        <a href="https://wa.me/${p.whatsapp}" target="_blank" 
                           class="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center shadow-sm">
                            WHATSAPP
                        </a>
                    </div>
                </div>
            `;
        });
    });
}

// --- FUNÇÃO: SALVAR NOVO CADASTRO ---
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const profissao = document.getElementById('profissao').value;
    const descricao = document.getElementById('descricao').value;
    const whatsapp = document.getElementById('whatsapp').value;
    
    // Simplificado: Aqui você deve ter sua lógica de conversão de imagem para Base64 ou URL
    if(nome && profissao) {
        try {
            await db.collection("profissionais").add({
                nome,
                profissao,
                descricao,
                whatsapp,
                curtidas: 0,
                data: new Date()
            });
            alert("Sucesso! Seu perfil está no ar.");
            document.getElementById('form-cadastro').classList.add('hidden');
        } catch (e) {
            alert("Erro ao salvar: " + e.message);
        }
    } else {
        alert("Preencha os campos obrigatórios!");
    }
}

// --- FUNÇÃO: EXCLUIR PROFISSIONAL (ADMIN) ---
function removerProfissional(id) {
    if (confirm("Tem certeza que deseja excluir este profissional?")) {
        db.collection("profissionais").doc(id).delete()
            .then(() => alert("Profissional removido!"))
            .catch((error) => alert("Erro ao excluir: " + error));
    }
}

// --- FUNÇÃO: CURTIDAS ---
function curtir(id, atual) {
    db.collection("profissionais").doc(id).update({
        curtidas: atual + 1
    });
}

// --- FUNÇÃO: FILTRO DE PESQUISA ---
function filtrarProfissionais() {
    const busca = document.getElementById('campo-pesquisa').value.toLowerCase();
    const cards = document.querySelectorAll('#lista-profissionais > div');

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(busca) ? "block" : "none";
    });
}

// Inicializar a lista ao carregar a página
carregarProfissionais();
