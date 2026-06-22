async function carregarMetas() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data } =
        await window.supabaseClient
            .from("metas")
            .select("*")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false });

    const lista =
        document.getElementById("listaMetas");

    lista.innerHTML = "";

    data.forEach(meta => {

        lista.innerHTML += `
            <div class="card">

                <h3>${meta.titulo}</h3>

                <p>${meta.descricao || ""}</p>

                <p>
                    Status:
                    ${meta.status}
                </p>

                <button onclick="concluirMeta('${meta.id}')">
                    Concluir
                </button>

            </div>
        `;
    });
}

async function salvarMeta(event) {

    event.preventDefault();

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    await window.supabaseClient
        .from("metas")
        .insert({

            usuario_id: user.id,

            titulo:
                document.getElementById("titulo").value,

            descricao:
                document.getElementById("descricao").value

        });

    document
        .getElementById("metaForm")
        .reset();

    carregarMetas();
}

async function concluirMeta(id) {

    await window.supabaseClient
        .from("metas")
        .update({
            status: "Concluída"
        })
        .eq("id", id);

    carregarMetas();
}

document
    .getElementById("metaForm")
    .addEventListener("submit", salvarMeta);

carregarMetas();