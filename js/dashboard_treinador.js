const db = window.supabaseClient;

async function verificarLogin() {
    const { data } = await db.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

async function obterTreinadorId() {
    const { data } = await db.auth.getSession();
    return data.session.user.id;
}

async function carregarTreinador() {

    const id = await obterTreinadorId();

    const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("nomeTreinador").innerHTML = `
        Bem-vindo,<br>
        ${data.nome} 👋
    `;
}

async function carregarUsuarios() {

    const treinadorId = await obterTreinadorId();

    // alunos já vinculados
    const { data: vinculados } = await db
        .from("treinador_alunos")
        .select("aluno_id")
        .eq("treinador_id", treinadorId);

    const idsVinculados = vinculados
        ? vinculados.map(a => a.aluno_id)
        : [];

    let consulta = db
        .from("profiles")
        .select("id,nome")
        .eq("tipo", "aluno");

    if (idsVinculados.length > 0) {
        consulta = consulta.not("id", "in", `(${idsVinculados.join(",")})`);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error(error);
        return;
    }

    const select = document.getElementById("listaUsuarios");

    select.innerHTML = "";

    if (data.length === 0) {
        select.innerHTML = `
            <option>
                Todos os alunos já foram adicionados
            </option>
        `;
        return;
    }

    data.forEach(aluno => {

        select.innerHTML += `
            <option value="${aluno.id}">
                ${aluno.nome}
            </option>
        `;

    });

}

function abrirModalAluno() {
    document.getElementById("modalAluno").style.display = "flex";
    carregarUsuarios();
}

function fecharModal() {
    document.getElementById("modalAluno").style.display = "none";
}

async function adicionarAluno() {

    const alunoId = document.getElementById("listaUsuarios").value;

    if (!alunoId) return;

    const treinadorId = await obterTreinadorId();

    const { data: existente } = await db
        .from("treinador_alunos")
        .select("*")
        .eq("treinador_id", treinadorId)
        .eq("aluno_id", alunoId);

    if (existente.length > 0) {
        alert("Este aluno já está vinculado.");
        return;
    }

    const { error } = await db
        .from("treinador_alunos")
        .insert({
            treinador_id: treinadorId,
            aluno_id: alunoId
        });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Aluno adicionado com sucesso!");

    fecharModal();

    await carregarMeusAlunos();

}

async function carregarMeusAlunos() {

    const treinadorId = await obterTreinadorId();

    const { data, error } = await db
        .from("treinador_alunos")
        .select(`
            id,
            aluno:profiles!treinador_alunos_aluno_id_fkey(
                id,
                nome
            )
        `)
        .eq("treinador_id", treinadorId);

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("totalAlunos").innerText = data.length;

    const lista = document.getElementById("listaAlunos");

    lista.innerHTML = "";

    if (data.length === 0) {

        lista.innerHTML = `
            <p>Nenhum aluno vinculado.</p>
        `;

        return;

    }

    data.forEach(item => {

        lista.innerHTML += `

        <div class="card" style="margin-bottom:20px">

            <h3>${item.aluno.nome}</h3>

            <div style="margin-top:15px">

                <button onclick="gerenciarAluno('${item.aluno.id}')">

                    Gerenciar

                </button>

                <button
                    onclick="removerAluno('${item.id}')"
                    style="background:#dc3545;margin-left:10px;">

                    Remover

                </button>

            </div>

        </div>

        `;

    });

}

function gerenciarAluno(id) {

    // Etapa 4
    window.location.href = `aluno_treinador.html?id=${id}`;

}

async function removerAluno(vinculoId) {

    const confirmar = confirm("Deseja remover este aluno?");

    if (!confirmar) return;

    const { error } = await db
        .from("treinador_alunos")
        .delete()
        .eq("id", vinculoId);

    if (error) {
        alert(error.message);
        return;
    }

    await carregarMeusAlunos();

}

async function logout() {

    await db.auth.signOut();

    window.location.href = "login.html";

}

async function iniciar() {

    const ok = await verificarLogin();

    if (!ok) return;

    await carregarTreinador();

    await carregarMeusAlunos();

}

iniciar();