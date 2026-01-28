// 1. Configuração (Mantenha os SEUS dados que já funcionam)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.appspot.com",
  messagingSenderId: "7777777",
  appId: "1:7777777"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. Função Publicar (Ajustada para não travar e salvar TUDO)
async function salvarCadastro() {
  try {
    const nome = document.getElementById('nome').value;
    const profissao = document.getElementById('profissao').value;
    const descricao = document.getElementById('descricao').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const fCapa = document.getElementById('fotoCapaInput').files[0];
    const fPerfil = document.getElementById('fotoPerfilInput').files[0];

    if (!nome || !profissao || !fCapa || !fPerfil) {
      alert("Preencha os campos e selecione as duas fotos!");
      return;
    }

    const reader1 = new FileReader();
    reader1.readAsDataURL(fCapa);
    reader1.onload = () => {
      const base64Capa = reader1.result;
      const reader2 = new FileReader();
      reader2.readAsDataURL(fPerfil);
      reader2.onload = async () => {
        const base64Perfil = reader2.result;

        await db.collection("profissionais").add({
          nome: nome,
          profissao: profissao,
          descricao: descricao,
          whatsapp: whatsapp,
          fotoCapa: base64Capa,
          fotoPerfil: base64Perfil,
          data: new Date()
        });

        alert("Publicado com sucesso!");
        location.reload();
      };
    };
  } catch (error) {
    alert("Erro ao publicar: " + error);
  }
}

// 3. Carregar Lista (Com o visual das fotos redondas que você aprovou)
function carregarProfissionais() {
  const lista = document.getElementById('listaProfissionais');
  db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      lista.innerHTML += `
        <div class="card">
          <img src="${p.fotoCapa}" class="capa-card">
          <div class="perfil-container">
            <img src="${p.fotoPerfil}" class="foto-perfil-lista" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid white; object-fit: cover;">
          </div>
          <div class="card-info">
            <h3>${p.nome}</h3>
            <p class="profissao-texto"><strong>${p.profissao}</strong></p>
            <p>${p.descricao}</p>
            <div class="botoes-card">
              <a href="https://wa.me/55${p.whatsapp}" class="btn-whats">WhatsApp</a>
              <button onclick="apagarPost('${doc.id}')" class="btn-admin" style="display:none;" data-admin>Apagar</button>
            </div>
          </div>
        </div>
      `;
    });
  });
}

// 4. Funções de Apoio (Admin e Denúncia)
function loginAdmin() {
  if (prompt("Senha:") === "2505") {
    document.querySelectorAll('[data-admin]').forEach(b => b.style.display = "block");
  }
}

async function apagarPost(id) {
  if (prompt("Senha para apagar:") === "2505") {
    await db.collection("profissionais").doc(id).delete();
    alert("Removido!");
  }
}

window.onload = carregarProfissionais;
