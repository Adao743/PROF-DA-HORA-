const firebaseConfig = {
  apiKey: "AIzaSyBm9dy9MXr9Lg31NqLX5wzWYuy5i_Q8Hdc",
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.firebasestorage.app",
  messagingSenderId: "124661519863",
  appId: "1:124661519863:web:600d142f499a0d5c43d810"
};
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

db.collection("profissionais").orderBy("data", "desc").onSnapshot((querySnapshot) => {
    const lista = document.getElementById('lista-profissionais');
    const isAdmin = localStorage.getItem('admin_key') === "2505";
    if (!lista) return;
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        lista.innerHTML += `
            <div class="bg-white rounded-xl shadow-lg mb-6 p-4 border border-gray-100 relative">
                ${isAdmin ? `<button onclick="remover('${id}')" style="position:absolute;top:10px;right:10px;background:#dc2626;color:white;padding:5px;border-radius:5px;font-size:10px;z-index:50">EXCLUIR</button>` : ''}
                <img src="${p.fotoCapa}" class="w-full h-32 object-cover rounded-lg">
                <div class="flex flex-col items-center mt-[-40px]">
                    <img src="${p.fotoPerfil}" class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white">
                    <h2 class="text-xl font-bold mt-2">${p.nome}</h2>
                    <p class="text-blue-600 font-bold">${p.profissao}</p>
                    <div onclick="curtir('${id}')" class="flex items-center gap-2 mt-2 bg-red-50 px-4 py-1 rounded-full cursor-pointer">
                        <span>❤️</span><span class="font-bold text-red-600">${p.likes || 0}</span>
                    </div>
                    <a href="https://wa.me/55${p.whatsapp}" target="_blank" class="w-full mt-3 bg-green-500 text-white text-center py-3 rounded-xl font-bold">WHATSAPP</a>
                </div>
            </div>`;
    });
});
async function curtir(id) {
    await db.collection("profissionais").doc(id).update({
        likes: firebase.firestore.FieldValue.increment(1)
    });
}

function remover(id) {
    if (confirm("Deseja realmente excluir este cadastro?")) {
        db.collection("profissionais").doc(id).delete()
        .then(() => {
            alert("Profissional removido com sucesso!");
        })
        .catch((error) => {
            alert("Erro ao remover: " + error);
        });
    }
}

function filtrarProfissionais() {
    let input = document.getElementById('campo-pesquisa').value.toLowerCase();
    let cards = document.getElementById('lista-profissionais').getElementsByClassName('bg-white');
    
    for (let card of cards) {
        let textoCard = card.innerText.toLowerCase();
        if (textoCard.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}
