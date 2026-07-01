const db = window.supabaseClient;

async function verificarLogin() {

    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";

        return false;

    }

    return true;
}

async function carregarTreinador() {

    const { data: session } = await db.auth.getSession();

    const id = session.session.user.id;

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

    const { data, error } = await db
        .from("profiles")
        .select("id, nome")
        .eq("type", "aluno");

    if (error) {

        console.error(error);

        return;

    }

    const select = document.getElementById("listaUsuarios");

    select.innerHTML = "";

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

    const alunoId =
        document.getElementById("listaUsuarios").value;

    const { data: session } =
        await db.auth.getSession();

    const treinadorId = session.session.user.id;

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

}

async function logout() {

    await db.auth.signOut();

    window.location.href = "login.html";

}

async function iniciar() {

    const ok = await verificarLogin();

    if (!ok) return;

    await carregarTreinador();

}

iniciar();