document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("loginSuccess").style.display = "block";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        })
        .catch((error) => {
            alert("Неверный email или пароль");
        });
});
