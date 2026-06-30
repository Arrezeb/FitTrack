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

    const { data } = await db
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    document.getElementById("nomeTreinador").innerHTML = `
        Bem-vindo,<br>
        ${data.nome} 👋
    `;

}

async function logout(){

    await db.auth.signOut();

    window.location.href="login.html";

}

async function iniciar(){

    const ok=await verificarLogin();

    if(!ok)return;

    await carregarTreinador();

}

iniciar();