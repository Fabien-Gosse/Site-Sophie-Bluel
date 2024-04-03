function fieldsValidation() {
  const formLogin = document.querySelector(".formLogin");
  formLogin.addEventListener("submit", function (evt) {
    evt.preventDefault();

    let baliseEmail = document.getElementById("email");
    email = baliseEmail.value;
    let balisePassword = document.getElementById("password");
    password = balisePassword.value;
    console.log(email);
    console.log(password);

    if (email + password === "sophie.bluel@test.tld" + "S0phie") {
      const idConnexion = {
        email: email,
        password: password,
      };
      const bodyCharge = JSON.stringify(idConnexion);
      getToken(bodyCharge);
    } else {
      let popupBackground = document.querySelector(".popupBackground");
      // Quand on a cliqué sur le bouton partagé, on affiche la popup
      popupShow();

      // On écoute le click sur la div "popupBackground"
      popupBackground.addEventListener("click", (event) => {
        // Si on a cliqué précisément sur la popupBackground
        // (et pas un autre élément qui se trouve dedant)
        if (event.target === popupBackground) {
          // Alors on cache la popup
          popupHide();
        }
      });
    }
  });
}

function popupShow() {
  let popupBackground = document.querySelector(".popupBackground");
  popupBackground.classList.add("active");
}

function popupHide() {
  let popupBackground = document.querySelector(".popupBackground");
  popupBackground.classList.remove("active");
}

fieldsValidation();

async function getToken(bodyCharge) {
  const getLogin = (
    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyCharge,
    })
  ).json();

  await getLogin.then((value) => {
    token = value.token;
    console.log(token);
    return token;
  });
  login(token);
}

function login(token) {
  localStorage.setItem("tokenLogin", token);
  document.location.href = "./index.html";
}
