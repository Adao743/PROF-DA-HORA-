// FUNÇÃO MÁGICA PARA DIMINUIR A FOTO
function redimensionarImagem(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Define o tamanho máximo (800 pixels)
            const max_size = 800;
            if (width > height) {
                if (width > max_size) {
                    height *= max_size / width;
                    width = max_size;
                }
            } else {
                if (height > max_size) {
                    width *= max_size / height;
                    height = max_size;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Transforma em JPEG com 70% de qualidade para ficar leve
            callback(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// NOVOS OUVINTES DE FOTO (USANDO O REDIMENSIONADOR)
document.getElementById('fotoCapaInput').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        redimensionarImagem(e.target.files[0], (base64) => {
            capaBase64 = base64;
            console.log("Capa pronta e leve!");
        });
    }
});

document.getElementById('fotoPerfilInput').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        redimensionarImagem(e.target.files[0], (base64) => {
            perfilBase64 = base64;
            console.log("Perfil pronto e leve!");
        });
    }
});
