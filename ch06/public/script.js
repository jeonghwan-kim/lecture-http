const init = () => {
  const loginForm = document.querySelector("#login-form");
  if (!loginForm) throw "no #login-form";

  loginForm.addEventListener("submit", handleSubmit);
};

const handleSubmit = (event) => {
  // todo
};

document.addEventListener("DOMContentLoaded", init);
