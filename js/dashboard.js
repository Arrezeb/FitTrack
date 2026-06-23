async function verificarLogin() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";

        return;
    }

    carregarUsuario();
}

async function carregarUsuario() {


    const { data: sessionData } =
        await supabase.auth.getSession();

    const userId = sessionData.session.user.id;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {

        console.error(error);

        return;
    }

    document.getElementById("nomeUsuario")
        .innerText = `Olá, ${data.nome}! 👋`;
}

async function carregarTotalTreinos() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data, error } =
        await window.supabaseClient
            .from("treinos")
            .select("id")
            .eq("usuario_id", user.id);

    if (error) {

        console.error(error);

        return;
    }

    document
        .getElementById("totalTreinos")
        .innerText = data.length;
}

async function carregarTotalMetas() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data, error } =
        await window.supabaseClient
            .from("metas")
            .select("id")
            .eq("usuario_id", user.id);

    if (error) {

        console.error(error);

        return;
    }

    document
        .getElementById("metas")
        .innerText = data.length;
}

async function carregarUltimoPeso() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data, error } =
        await window.supabaseClient
            .from("medidas")
            .select("peso")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

    if (error) {

        console.error(error);

        return;
    }

    if (data.length > 0) {

        document
            .getElementById("ultimoPeso")
            .innerText = `${data[0].peso} kg`;
    }
}

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";
}

async function criarGrafico() {

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    const { data, error } =
        await window.supabaseClient
            .from("medidas")
            .select("peso, created_at")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: true });

    if (error) {

        console.error(error);

        return;
    }

    const labels =
        data.map(item =>
            new Date(item.created_at)
                .toLocaleDateString("pt-BR")
        );

    const pesos =
        data.map(item => item.peso);

    const ctx =
        document.getElementById("graficoPeso");

    new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [{

                label: "Peso (kg)",

                data: pesos

            }]
        }
    });
}

    const ctx =
        document.getElementById("graficoPeso");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun"
            ],

            datasets: [{

                label: "Peso (kg)",

                data: [
                    70,
                    69,
                    68,
                    67,
                    67,
                    66
                ]

            }]
        }
    });
}

verificarLogin();

carregarTotalTreinos();

carregarTotalMetas();

carregarUltimoPeso();

criarGrafico();