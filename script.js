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

async function redimensionarImagem(file, larguraMax = 400) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const escala = larguraMax / img.width;
                canvas.width = larguraMax;
                canvas.height = img.height * escala;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
}

db.collection("profissionais").orderBy("data", "desc").onSnapshot((querySnapshot) => {
    const lista = document.getElementById('lista-profissionais');
    const isAdmin = localStorage.getItem('admin_key') === "2505";
    if (!lista) return;
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        lista.innerHTML += `
            <div class="bg-white rounded-xl shadow-lg mb-6 p-4 border border-gray-100 relative text-center">
                ${isAdmin ? `<button onclick="remover('${id}')" class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded text-xs z-50">EXCLUIR</button>` : ''}
                <img src="${p.fotoCapa}" class="w-full h-32 object-cover rounded-lg">
                <div class="flex flex-col items-center mt-[-40px]">
                    <img src="${p.fotoPerfil}" class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white">
                    <h2 class="text-xl font-bold mt-2 uppercase">${p.nome}</h2>
                    <p class="text-blue-600 font-bold">${p.profissao}</p>
                    <p class="text-gray-600 text-sm px-4 mt-2 mb-2 italic">"${p.descricao || ''}"</p>
                    <div onclick="curtir('${id}')" class="flex items-center gap-2 mb-3 bg-red-50 px-4 py-1 rounded-full cursor-pointer">
                        <span>❤️</span><span class="font-bold text-red-600">${p.likes || 0}</span>
                    </div>
                    <a href="https://wa.me/${p.whatsapp}" target="_blank" class="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md">WHATSAPP</a>
                </div>
            </div>`;
    });
});

async function salvarCadastro() {
    const btn = document.getElementById('btnSalvar');
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const profissao = document.getElementById('profissao').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const fotoCapaFile = document.getElementById('fotoCapaInput').files[0];
    const fotoPerfilFile = document.getElementById('fotoPerfilInput').files[0];

    if (!nome || !fotoCapaFile || !fotoPerfilFile) {
        alert("Preencha o nome e selecione as fotos!");
        return;
    }

    btn.innerText = "Processando fotos... aguarde";
    btn.disabled = true;

    try {
        const fotoCapaBase64 = await redimensionarImagem(fotoCapaFile, 500);
        const fotoPerfilBase64 = await redimensionarImagem(fotoPerfilFile, 200);

        await db.collection("profissionais").add({
            nome: nome,
            descricao: descricao,
            profissao: profissao,
            whatsapp: whatsapp,
            fotoCapa: fotoCapaBase64,
            fotoPerfil: fotoPerfilBase64,
            likes: 0,
            data: new Date().getTime()
        });

        alert("Cadastro realizado com sucesso!");
        location.reload();
    } catch (error) {
        alert("Erro ao salvar. Tente fotos menores.");
        btn.innerText = "PUBLICAR AGORA";
        btn.disabled = false;
    }
}

async function curtir(id) {
    await db.collection("profissionais").doc(id).update({
        likes: firebase.firestore.FieldValue.increment(1)
    });
}

function remover(id) {
    if (confirm("Excluir este profissional?")) {
        db.collection("profissionais").doc(id).delete();
    }
}
