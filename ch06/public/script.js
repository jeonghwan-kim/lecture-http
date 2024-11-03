const init = () => {
  const loginForm = document.querySelector("#login-form");
  if (!loginForm) throw "no #login-form";

  loginForm.addEventListener("submit", handleSubmit);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const jsonData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      alert("API Error");
      return;
    }

    const body = await response.json();
    alert("Success: " + body.authenticated);
  } catch (error) {
    alert("Network Error");
  }
};

document.addEventListener("DOMContentLoaded", init);
