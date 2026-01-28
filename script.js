// CONFIGURAÇÃO DO FIREBASE (MANTENHA OS SEUS DADOS AQUI)
const firebaseConfig = {
  apiKey: "AIzaSy...", // NÃO mude esses dados se já estiverem funcionando
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.appspot.com",
  messagingSenderId: "777...",
  appId: "1:777..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// FUNÇÃO PARA SALVAR NOVO PROFISSIONAL
async function salvarCadastro() {
  try {
    const nome = document.getElementById('nome').value;
    const profissao = document.getElementById('profissao').value;
    const descricao = document.getElementById('descricao').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const fCapa = document.getElementById('fotoCapaInput').files[0];
    const fPerfil = document.getElementById('fotoPerfilInput').files[0];

    if (!nome || !profissao || !fCapa || !fPerfil) {
      alert("Preencha todos os campos e selecione as duas fotos!");
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

// FUNÇÃO PARA CARREGAR E EXIBIR OS CARDS
function carregarProfissionais() {
  const lista = document.getElementById('listaProfissionais');
  lista.innerHTML = "";

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
            <p class="profissao-texto">${p.profissao}</p>
            <p>${p.descricao}</p>
            <div class="botoes-card">
              <a href="https://wa.me/55${p.whatsapp}" class="btn-whats">WhatsApp</a>
              <button onclick="denunciar()" class="btn-denuncia">Denunciar</button>
              <button onclick="apagarPost('${doc.id}')" class="btn-admin" style="display:none;" data-admin>Apagar</button>
            </div>
          </div>
        </div>
      `;
    });
  });
}

// FUNÇÃO APAGAR (SÓ COM SENHA)
async function apagarPost(id) {
  const senha = prompt("Digite a senha de administrador:");
  if (senha === "2505") {
    if (confirm("Tem certeza que deseja excluir este cadastro?")) {
      await db.collection("profissionais").doc(id).delete();
      alert("Excluído com sucesso!");
    }
  } else {
    alert("Senha incorreta!");
  }
}

// MODO ADMIN (MOSTRAR BOTÕES ESCONDIDOS)
function loginAdmin() {
  const senha = prompt("Senha do Administrador:");
  if (senha === "2505") {
    document.querySelectorAll('[data-admin]').forEach(btn => btn.style.display = "block");
    alert("Modo Administrador Ativado!");
  } else {
    alert("Senha incorreta!");
  }
}

function denunciar() {
  alert("Denúncia enviada! Analisaremos o perfil em breve.");
}

function sair() {
  window.location.href = "https://www.google.com";
}

// INICIALIZAR A LISTA AO ABRIR O SITE
window.onload = carregarProfissionais;
