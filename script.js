let profissionais = JSON.parse(localStorage.getItem('prof_da_hora_data')) || [];
let minhaFotoBase64 = "";
let idEdicao = null;

function fazerLogin() {
    const check = document.getElementById('aceite-termos');
    if (check && check.checked) {
        document.getElementById('tela-login').classList.add('hidden');
        document.getElementById('tela-app').classList.remove('hidden');
        renderizarLista();
    } else {
        alert("Aceite os termos para continuar.");
    }
}

function sairApp() {
    document.getElementById('tela-app').classList.add('hidden');
    document.getElementById('tela-login').classList.remove('hidden');
}

document.getElementById('foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 300; canvas.height = 300;
            ctx.drawImage(img, 0, 0, 300, 300);
            minhaFotoBase64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('preview-foto').innerHTML = `<img src="${minhaFotoBase64}" class="w-full h-full object-cover">`;
        }
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function salvarCadastro() {
    const nome = document.getElementById('nome').value;
    const prof = document.getElementById('profissao').value;
    const desc = document.getElementById('descricao').value;
    const whats = document.getElementById('whatsapp').value;
    if (!nome || !prof || !whats) return alert("Preencha os campos!");
    if (idEdicao) {
        const index = profissionais.findIndex(p => p.id === idEdicao);
        profissionais[index] = { ...profissionais[index], nome, profissao: prof, descricao: desc, whatsapp: whats, foto: minhaFotoBase64 || profissionais[index].foto };
        idEdicao = null;
        document.getElementById('btn-salvar').innerText = "SALVAR";
    } else {
        profissionais.push({ id: Date.now(), nome, profissao: prof, descricao: desc, whatsapp: whats, foto: minhaFotoBase64, likes: 0 });
    }
    localStorage.setItem('prof_da_hora_data', JSON.stringify(profissionais));
    limparCampos(); renderizarLista();
}

function renderizarLista(filtro = "") {
    const lista = document.getElementById('lista-publica');
    if(!lista) return;
    lista.innerHTML = '';
    const filtrados = profissionais.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()) || p.profissao.toLowerCase().includes(filtro.toLowerCase()));
    filtrados.forEach(p => {
        lista.innerHTML += `
            <div class="bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-4">
                <div class="flex gap-4">
                    <img src="${p.foto || 'https://via.placeholder.com/150'}" class="w-20 h-20 rounded-xl object-cover border">
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800">${p.nome}</h4>
                        <p class="text-blue-600 text-xs font-bold uppercase">${p.profissao}</p>
                        <p class="text-gray-500 text-xs mt-1">${p.descricao}</p>
                    </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                    <a href="https://wa.me/${p.whatsapp}" class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg font-bold text-sm">WhatsApp</a>
                    <button onclick="darLike(${p.id})" class="px-4 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-bold">❤️ ${p.likes}</button>
                    <button onclick="prepararEdicao(${p.id})" class="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Editar</button>
                    <button onclick="deletarUm(${p.id})" class="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold">Apagar</button>
                </div>
            </div>`;
    });
}

function prepararEdicao(id) {
    const p = profissionais.find(prof => prof.id === id);
    document.getElementById('nome').value = p.nome;
    document.getElementById('profissao').value = p.profissao;
    document.getElementById('descricao').value = p.descricao;
    document.getElementById('whatsapp').value = p.whatsapp;
    idEdicao = id;
    document.getElementById('btn-salvar').innerText = "ATUALIZAR";
    window.scrollTo(0, 0);
}

function deletarUm(id) {
    if (confirm("Remover este profissional?")) {
        profissionais = profissionais.filter(p => p.id !== id);
        localStorage.setItem('prof_da_hora_data', JSON.stringify(profissionais));
        renderizarLista();
    }
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('profissao').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('whatsapp').value = '';
    minhaFotoBase64 = "";
    idEdicao = null;
}

function buscar() { renderizarLista(document.getElementById('busca').value); }
function darLike(id) { 
    const p = profissionais.find(prof => prof.id === id);
    if(p) { p.likes++; localStorage.setItem('prof_da_hora_data', JSON.stringify(profissionais)); renderizarLista(); }
}
