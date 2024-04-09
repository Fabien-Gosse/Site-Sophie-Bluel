document.addEventListener("DOMContentLoaded", () => {
  void fieldsValidation();
});

async function fieldsValidation() {
  const formLogin = document.querySelector(".formLogin");
  formLogin.addEventListener("submit", async function (evt) {
    evt.preventDefault();

    const baliseEmail = document.getElementById("email");
    const balisePassword = document.getElementById("password");

    const email = baliseEmail.value;
    const password = balisePassword.value;

    const idConnexion = {
      email: email,
      password: password,
    };

    const bodyCharge = JSON.stringify(idConnexion);
    const response = await createToken(bodyCharge);

    if (response.token) {
      login(response.token);
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

async function createToken(bodyCharge) {
  // Fetch request to login endpoint
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodyCharge,
  });

  // Wait for the JSON response
  return await response.json();
}

function login(token) {
  localStorage.setItem("tokenLogin", token);
  document.location.href = "./index.html";
}
