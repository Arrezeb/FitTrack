async function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    const { data, error } = await window.supabaseClient.auth.signUp({

        email,

        password: senha

    });

    if (error) {

        alert(error.message);

        return;

    }

    await window.supabaseClient
    .from("profiles")
        .insert({

            id: data.user.id,

            nome: nome,

            tipo: "aluno"

        });

    alert("Cadastro realizado!");

    window.location.href = "login.html";
}

async function loginUsuario(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    const { error } =
        await window.supabaseClient.auth.signInWithPassword({

            email,

            password: senha

        });

    if (error) {

        alert(error.message);

        return;
    }

    window.location.href = "dashboard.html";
}

document
    .getElementById("cadastroForm")
    ?.addEventListener("submit", cadastrarUsuario);

document
    .getElementById("loginForm")
    ?.addEventListener("submit", loginUsuario);