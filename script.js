// Configuração do seu Firebase (Recuperada dos seus prints)
const firebaseConfig = {
  apiKey: "AIzaSyBm9dy9MXr9Lg31NqLX5wzWYuy5i_Q8Hdc",
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.firebasestorage.app",
  messagingSenderId: "124661519863",
  appId: "1:124661519863:web:600d142f499a0d5c43d810",
  measurementId: "G-37CWFVZQ9"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Sistema de Admin
const modoAdmin = localStorage.getItem('admin_key') === "2505";

// Função para Sair
function sairGeral() {
    localStorage.removeItem('admin_key');
    window.location.replace("https://www.google.com");
}

// BUSCAR PROFISSIONAIS (A Mágica que faz aparecer na tela)
db.collection("profissionais").orderBy("data", "desc").onSnapshot((querySnapshot) => {
    const lista = document.getElementById('lista-profissionais');
    if (!lista) return;
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;

        lista.innerHTML += `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6 p-4 border border-gray-100">
                <img src="${p.fotoCapa}" class="w-full h-40 object-cover rounded-lg shadow-inner">
                
                <div class="flex flex-col items-center mt-[-45px]">
                    <img src="${p.fotoPerfil}" class="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md">
                    
                    <h2 class="text-xl font-black mt-2 text-center uppercase text-gray-800">${p.nome}</h2>
                    <p class="text-blue-600 font-bold uppercase text-sm">${p.profissao}</p>
                    <p class="text-gray-500 text-sm text-center mt-3 px-2 italic">"${p.descricao}"</p>

                    <div onclick="curtir('${id}')" class="flex items-center gap-2 mt-4 mb-2 bg-red-50 py-2 px-6 rounded-full border border-red-100 cursor-pointer active:scale-95 transition">
                        <svg class="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span class="font-black text-xl text-red-600">${p.likes || 0}</span>
                    </div>
                    
                    <div class="flex gap-2 mt-4 w-full">
                        <a href="https://wa.me/55${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="flex-1 bg-green-500 text-white text-center py-4 rounded-2xl font-black shadow-lg uppercase tracking-wider">Chamar no Whats</a>
                        <button onclick="window.open('https://api.whatsapp.com/send?phone=5533999254363&text=Denuncia:${p.nome}')" class="bg-gray-100 text-gray-400 px-4 rounded-2xl text-[10px] font-bold uppercase">Denunciar</button>
                    </div>

                    ${modoAdmin ? `<button onclick="remover('${id}')" class="w-full bg-red-600 text-white py-3 rounded-2xl mt-3 font-black shadow-md">APAGAR POSTAGEM</button>` : ""}
                </div>
            </div>`;
    });
});

// FUNÇÃO PARA CURTIR
async function curtir(id) {
    const profRef = db.collection("profissionais").doc(id);
    await profRef.update({
        likes: firebase.firestore.FieldValue.increment(1)
    });
}

// FUNÇÃO PARA REMOVER (ADMIN)
async function remover(id) {
    if(confirm("Deseja apagar permanentemente?")) {
        await db.collection("profissionais").doc(id).delete();
    }
}

// LÓGICA DE PESQUISA
function filtrarProfissionais() {
    let input = document.getElementById('campo-pesquisa').value.toLowerCase();
    let cards = document.getElementsByClassName('bg-white');
    for (let i = 0; i < cards.length; i++) {
        if (!cards[i].innerText.toLowerCase().includes(input)) {
            cards[i].style.display = "none";
        } else {
            cards[i].style.display = "block";
        }
    }
}
