// Configuração do Firebase (Chaves do seu projeto Prof da Hora)
const firebaseConfig = {
  apiKey: "AIzaSyBm9dy9MXr9Lg3lNqLX5wzMYuy5i_Q8Hdc",
  authDomain: "prof-da-hora.firebaseapp.com",
  projectId: "prof-da-hora",
  storageBucket: "prof-da-hora.firebasestorage.app",
  messagingSenderId: "124661519863",
  appId: "1:124661519863:web:600d142f499a0d5c43d810",
  measurementId: "G-37CWFVZQ9"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variável para a foto (Base64 para não travar o S7)
let minhaFotoBase64 = "";

// Função para salvar o cadastro na Nuvem do Google
async function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const prof = document.getElementById('profissao').value;
    const desc = document.getElementById('descricao').value;
    const whats = document.getElementById('whatsapp').value;

    if (!nome || !prof || !whats) {
        alert("Por favor, preencha nome, profissão e WhatsApp!");
        return;
    }

    try {
        await db.collection("profissionais").add({
            nome: nome,
            profissao: prof,
            descricao: desc,
            whatsapp: whats,
            foto: minhaFotoBase64,
            data: new Date()
        });
        alert("✅ Cadastrado com sucesso na nuvem!");
        
        // Limpa os campos após salvar
        document.getElementById('nome').value = "";
        document.getElementById('profissao').value = "";
        document.getElementById('descricao').value = "";
        document.getElementById('whatsapp').value = "";
        minhaFotoBase64 = "";
        
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao conectar com o banco de dados.");
    }
}

// Função para carregar a lista em tempo real
function carregarLista() {
    const lista = document.getElementById('lista-profissionais');
    if (!lista) return;

    db.collection("profissionais").orderBy("data", "desc").onSnapshot((snapshot) => {
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            lista.innerHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 10px; background: white;">
                    <img src="${p.foto || 'https://via.placeholder.com/80'}" style="width: 80px; height: 80px; border-radius: 50%; object-cover: cover;">
                    <h3>${p.nome}</h3>
                    <p><strong>${p.profissao}</strong></p>
                    <p>${p.descricao}</p>
                    <a href="https://wa.me/${p.whatsapp}" target="_blank" style="background: #25d366; color: white; padding: 5px 10px; text-decoration: none; border-radius: 5px;">Chamar no Whats</a>
                </div>
            `;
        });
    });
}

// Inicia a lista assim que abrir a página
carregarLista();
