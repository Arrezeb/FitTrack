const db = window.supabaseClient;

const params = new URLSearchParams(window.location.search);
const alunoId = params.get("id");

let graficoPeso = null;

async function verificarLogin() {

    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";

        return false;

    }

    return true;

}

function voltarDashboard() {

    window.location.href = "dashboard_treinador.html";

}

function abrirAba(nomeAba) {

    document.querySelectorAll(".conteudoAba").forEach(div => {

        div.style.display = "none";

    });

    document.querySelectorAll(".aba").forEach(botao => {

        botao.classList.remove("ativa");

    });

    document.getElementById(nomeAba).style.display = "block";

    event.target.classList.add("ativa");

}

function abrirModalMedida() {

    document.getElementById("modalMedida").style.display = "flex";

}

function abrirModalTreino() {

    document.getElementById("modalTreino").style.display = "flex";

}

function abrirModalMeta() {

    document.getElementById("modalMeta").style.display = "flex";

}

function fecharModal(id) {

    document.getElementById(id).style.display = "none";

}

async function carregarAluno() {

    const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", alunoId)
        .single();

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById("nomeAluno").innerText = data.nome;

}

async function carregarMedidas() {

    const { data, error } = await db
        .from("medidas")
        .select("*")
        .eq("usuario_id", alunoId)
        .order("created_at", { ascending: true });

    if (error) {

        console.error(error);

        return;

    }

    const tabela = document.getElementById("listaMedidas");

    tabela.innerHTML = "";

    if (data.length === 0) {

        document.getElementById("pesoAtual").innerText = "-- kg";
        document.getElementById("alturaAluno").innerText = "--";
        document.getElementById("imcAluno").innerText = "--";

        atualizarGrafico([], []);

        return;

    }

    const pesos = [];
    const datas = [];

    data.forEach(medida => {

        const dataFormatada = new Date(medida.created_at)
            .toLocaleDateString("pt-BR");

        tabela.innerHTML += `

            <tr>

                <td>${dataFormatada}</td>

                <td>${medida.peso} kg</td>

                <td>${medida.altura} m</td>

            </tr>

        `;

        pesos.push(Number(medida.peso));

        datas.push(dataFormatada);

    });

    const ultima = data[data.length - 1];

    document.getElementById("pesoAtual").innerText =
        `${ultima.peso} kg`;

    document.getElementById("alturaAluno").innerText =
        `${ultima.altura} m`;

    let imc = ultima.imc;

    if (!imc && ultima.peso && ultima.altura) {

        imc =
            (ultima.peso /
                (ultima.altura * ultima.altura))
                .toFixed(2);

    }

    document.getElementById("imcAluno").innerText = imc;

    atualizarGrafico(datas, pesos);

}

function atualizarGrafico(labels, valores) {

    const ctx =
        document.getElementById("graficoPeso");

    if (graficoPeso) {

        graficoPeso.destroy();

    }

    graficoPeso = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Peso (kg)",

                    data: valores,

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });

}

async function salvarMedida() {

    const peso = parseFloat(document.getElementById("peso").value);
    const altura = parseFloat(document.getElementById("altura").value);

    if (!peso || !altura) {
        alert("Preencha peso e altura.");
        return;
    }

    const imc = (peso / (altura * altura)).toFixed(2);

    const { error } = await db
        .from("medidas")
        .insert({
            usuario_id: alunoId,
            peso: peso,
            altura: altura,
            cintura: null,
            braco: null,
            perna: null,
            imc: imc
        });

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    document.getElementById("peso").value = "";
    document.getElementById("altura").value = "";

    fecharModal("modalMedida");

    await carregarMedidas();

}

async function carregarTreinos() {

    const { data, error } = await db
        .from("treinos")
        .select("*")
        .eq("usuario_id", alunoId)
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    const lista = document.getElementById("listaTreinos");

    lista.innerHTML = "";

    if (data.length === 0) {

        lista.innerHTML = `
            <p>Nenhum treino cadastrado.</p>
        `;

        return;

    }

    data.forEach(treino => {

        lista.innerHTML += `

            <div class="card" style="margin-bottom:15px">

                <h3>${treino.nome}</h3>

                <p><strong>Exercício:</strong> ${treino.exercicio}</p>

                <p><strong>Séries:</strong> ${treino.series}</p>

                <p><strong>Repetições:</strong> ${treino.repeticoes}</p>

            </div>

        `;

    });

}

async function salvarTreino() {

    const nome = document.getElementById("nomeTreino").value.trim();
    const descricao = document.getElementById("descricaoTreino").value.trim();

    if (!nome || !descricao) {

        alert("Preencha todos os campos.");

        return;

    }

    const { error } = await db
        .from("treinos")
        .insert({

            usuario_id: alunoId,

            nome: nome,

            exercicio: descricao,

            series: 3,

            repeticoes: 10

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    document.getElementById("nomeTreino").value = "";
    document.getElementById("descricaoTreino").value = "";

    fecharModal("modalTreino");

    await carregarTreinos();

}

async function carregarMetas() {

    const { data, error } = await db
        .from("metas")
        .select("*")
        .eq("usuario_id", alunoId)
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    const lista = document.getElementById("listaMetas");

    lista.innerHTML = "";

    if (data.length === 0) {

        lista.innerHTML = `
            <p>Nenhuma meta cadastrada.</p>
        `;

        return;

    }

    data.forEach(meta => {

        lista.innerHTML += `

            <div class="card" style="margin-bottom:15px">

                <h3>${meta.titulo}</h3>

                <p>${meta.descricao ?? ""}</p>

                <p>

                    <strong>Status:</strong>

                    ${meta.status}

                </p>

                ${
                    meta.status !== "Concluída"
                    ? `
                    <button
                        onclick="concluirMeta('${meta.id}')">

                        Concluir

                    </button>
                    `
                    : ""
                }

            </div>

        `;

    });

}

async function salvarMeta() {

    const titulo =
        document.getElementById("descricaoMeta").value.trim();

    if (!titulo) {

        alert("Informe uma meta.");

        return;

    }

    const { error } = await db
        .from("metas")
        .insert({

            usuario_id: alunoId,

            titulo: titulo,

            descricao: "",

            status: "Pendente"

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    document.getElementById("descricaoMeta").value = "";

    fecharModal("modalMeta");

    await carregarMetas();

}

async function concluirMeta(id) {

    const { error } = await db
        .from("metas")
        .update({

            status: "Concluída"

        })
        .eq("id", id);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    await carregarMetas();

}

async function iniciar() {

    const ok = await verificarLogin();

    if (!ok) return;

    if (!alunoId) {

        alert("Aluno não informado.");

        voltarDashboard();

        return;

    }

    await carregarAluno();

    await carregarMedidas();

    await carregarTreinos();

    await carregarMetas();

}

iniciar();