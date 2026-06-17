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

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";
}

function criarGrafico() {

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

criarGrafico();