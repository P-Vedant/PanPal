const { createClient } = window.supabase;

const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk"
const supabase = createClient(supabaseUrl, supabaseKey);

const loginBtn = document.getElementById("loginBtn");
loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error, session } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    document.getElementById("error-msg").textContent = error.message;
  } else {
    window.location.href = "display.html";
  }
});

const signupBtnIndex = document.getElementById("signupBtn-index");
signupBtnIndex?.addEventListener("click", async () => {
  window.location.href = "signup.html";
})

const loginBtnSignup = document.getElementById("loginBtn-signup");
loginBtnSignup?.addEventListener("click", async () => {
  window.location.href = "index.html";
});

//Signup
const signupBtn = document.getElementById("signupBtn");
signupBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const city = document.getElementById("city").value;

  const { error: signUpError, user } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    document.getElementById("error-msg").textContent = signUpError.message;
  } else {
    const { error: insertError } = await supabase.from("table").insert([
      {
        firstName: firstName,
        lastName: lastName,
        city: city,
        email: email,
      },
    ]);

    if (insertError) {
      document.getElementById("error-msg").textContent = insertError.message;
    } else {
      window.location.href = "index.html";
    }
  }
});