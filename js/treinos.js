async function carregarTreinos() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data, error } = await window.supabaseClient
        .from("treinos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const lista = document.getElementById("listaTreinos");

    lista.innerHTML = "";

    data.forEach(treino => {

        lista.innerHTML += `
            <div class="card">
                <h3>${treino.nome}</h3>

                <p>
                    Exercício:
                    ${treino.exercicio}
                </p>

                <p>
                    ${treino.series} séries
                    x
                    ${treino.repeticoes}
                    reps
                </p>

                <button onclick="excluirTreino('${treino.id}')">
                    Excluir
                </button>
            </div>
        `;
    });
}

async function salvarTreino(event) {

    event.preventDefault();

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    await window.supabaseClient
        .from("treinos")
        .insert({

            usuario_id: user.id,

            nome: document.getElementById("nomeTreino").value,

            exercicio: document.getElementById("exercicio").value,

            series: Number(document.getElementById("series").value),

            repeticoes: Number(document.getElementById("repeticoes").value)

        });

    document.getElementById("treinoForm").reset();

    carregarTreinos();
}

async function excluirTreino(id) {

    await window.supabaseClient
        .from("treinos")
        .delete()
        .eq("id", id);

    carregarTreinos();
}

document
    .getElementById("treinoForm")
    .addEventListener("submit", salvarTreino);

carregarTreinos();