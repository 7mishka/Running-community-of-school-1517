document.getElementById("registrationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const grade = document.getElementById('classs').value;
        if (grade < 8 || grade > 11) {
            alert('Невозможна регистрация с таким классом');
            return;
        }
        
    const age = document.getElementById('age').value;
        if (age < 13 || age > 18) {
            alert('Невозможна регистрация с таким возрастом');
            return;
        }
        
        if (password.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            return;
        }


    const userData = {
        username: document.getElementById("username").value,
        classs: document.getElementById("classs").value,
        corpus: document.getElementById("corpus").value,
        age: document.getElementById("age").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        email: email
    };

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;

            return db.collection("users").doc(uid).set(userData);
        })
        .then(() => {
            alert("Регистрация успешна!");
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

