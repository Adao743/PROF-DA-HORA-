includes(filtro.toLowerCase())
    );

    filtrados.forEach((p, index) => {
        lista.innerHTML += `
            <div class="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                <div class="flex gap-4 items-start">
                    <img src="${p.foto || 'https://via.placeholder.com/80'}" class="w-16 h-16 rounded-full object-cover border-2 border-blue-100">
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800">${p.nome}</h4>
                        <p class="text-blue-600 text-sm font-semibold">${p.profissao}</p>
                        <p class="text-gray-500 text-xs mt-1">${p.descricao}</p>
                    </div>
                </div>
                <div class="mt-4 flex gap-2">
                    <a href="https://wa.me/${p.whatsapp}" target="_blank" class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg font-bold text-sm">WhatsApp</a>
                    <button onclick="darLike(${p.id})" class="px-4 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-bold border border-pink-100">❤️ ${p.likes}</button>
                </div>
            </div>
        `;
    });
}

function buscar() {
    const termo = document.getElementById('busca').value;
    renderizarLista(termo);
}

function darLike(id) {
    const prof = profissionais.find(p => p.id === id);
    if(prof) {
        prof.likes++;
        localStorage.setItem('prof_da_hora_data', JSON.stringify(profissionais));
        renderizarLista(document.getElementById('busca').value);
    }
}

function deletarMeuCadastro() {
    if(confirm("Deseja apagar todos os cadastros salvos neste dispositivo?")) {
        profissionais = [];
        localStorage.removeItem('prof_da_hora_data');
        renderizarLista();
    }
}
