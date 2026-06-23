const supabase = window.supabaseClient;

async function verificarLogin() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";

        return false;
    }

    await carregarUsuario();

    return true;
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

        console.error("Erro ao carregar usuário:", error);

        return;
    }

    document.getElementById("nomeUsuario")
        .innerText = `Olá, ${data.nome}! 👋`;
}

async function carregarTotalTreinos() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
        await supabase
            .from("treinos")
            .select("id")
            .eq("usuario_id", user.id);

    if (error) {

        console.error("Erro ao carregar treinos:", error);

        return;
    }

    document.getElementById("totalTreinos")
        .innerText = data.length;
}

async function carregarTotalMetas() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
        await supabase
            .from("metas")
            .select("id")
            .eq("usuario_id", user.id);

    if (error) {

        console.error("Erro ao carregar metas:", error);

        return;
    }

    document.getElementById("metas")
        .innerText = data.length;
}

async function carregarUltimoPeso() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
        await supabase
            .from("medidas")
            .select("peso")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

    if (error) {

        console.error("Erro ao carregar peso:", error);

        return;
    }

    if (data && data.length > 0) {

        document.getElementById("ultimoPeso")
            .innerText = `${data[0].peso} kg`;

    } else {

        document.getElementById("ultimoPeso")
            .innerText = "-- kg";
    }
}

async function criarGrafico() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
        await supabase
            .from("medidas")
            .select("peso, created_at")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: true });

    if (error) {

        console.error("Erro ao carregar gráfico:", error);

        return;
    }

    const labels = data.map(item =>
        new Date(item.created_at)
            .toLocaleDateString("pt-BR")
    );

    const pesos = data.map(item => item.peso);

    const ctx =
        document.getElementById("graficoPeso");

    if (!ctx) return;

    new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Peso (kg)",

                data: pesos,

                tension: 0.3
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false
        }
    });
}

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";
}

async function iniciarDashboard() {

    const logado = await verificarLogin();

    if (!logado) return;

    await carregarTotalTreinos();

    await carregarTotalMetas();

    await carregarUltimoPeso();

    await criarGrafico();
}

iniciarDashboard();