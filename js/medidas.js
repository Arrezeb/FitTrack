async function salvarMedidas(event) {

    event.preventDefault();

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const peso =
        Number(document.getElementById("peso").value);

    const altura =
        Number(document.getElementById("altura").value);

    const cintura =
        Number(document.getElementById("cintura").value);

    const braco =
        Number(document.getElementById("braco").value);

    const perna =
        Number(document.getElementById("perna").value);

    const imc =
        (peso / (altura * altura)).toFixed(2);

    await window.supabaseClient
        .from("medidas")
        .insert({

            usuario_id: user.id,

            peso,
            altura,
            cintura,
            braco,
            perna,
            imc

        });

    document
        .getElementById("medidasForm")
        .reset();

    carregarHistorico();
}

async function carregarHistorico() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data } =
        await window.supabaseClient
            .from("medidas")
            .select("*")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false });

    const historico =
        document.getElementById("historicoMedidas");

    historico.innerHTML = "";

    data.forEach(medida => {

        historico.innerHTML += `
            <div class="card">

                <h3>
                    Peso: ${medida.peso} kg
                </h3>

                <p>
                    Altura: ${medida.altura} m
                </p>

                <p>
                    IMC: ${medida.imc}
                </p>

                <p>
                    Cintura: ${medida.cintura} cm
                </p>

                <p>
                    Braço: ${medida.braco} cm
                </p>

                <p>
                    Perna: ${medida.perna} cm
                </p>

            </div>
        `;
    });
}

document
    .getElementById("medidasForm")
    .addEventListener("submit", salvarMedidas);

carregarHistorico();