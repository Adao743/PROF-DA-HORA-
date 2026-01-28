) {
  if (prompt("Senha:") === "2505") {
    document.querySelectorAll('[data-admin]').forEach(b => b.style.display = "block");
  }
}

async function apagarPost(id) {
  if (prompt("Senha para apagar:") === "2505") {
    await db.collection("profissionais").doc(id).delete();
    alert("Removido!");
  }
