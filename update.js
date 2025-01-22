const { createClient } = window.supabase;

const supabaseUrl = "https://egzhuriimugvkjiauphl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnemh1cmlpbXVndmtqaWF1cGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzEzNjcsImV4cCI6MjAzOTY0NzM2N30.29e4s0hYCEB3e4m0GDB2WgSpEDbiJSSC4FOg5aU8ZOk";

const supabase = createClient(supabaseUrl, supabaseKey);

const displayBtn = document.getElementById("displayBtn");
displayBtn?.addEventListener("click", async () => {
  window.location.href = "display.html";
});



// Fetch session data
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log("Error getting session:", error);
    return null;
  }
  console.log("Session data:", data); // Log the session data
  return data.session;
}

// Update profile
const updateBtn = document.getElementById("updateBtn");
updateBtn?.addEventListener("click", async () => {
  // Grab the input field values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const city = document.getElementById("city").value;

  // Get the current session
  const session = await getSession();
  if (!session) {
    document.getElementById("error-msg").textContent =
      "No active session found. Please log in.";
    return;
  }


  const { data, error } = await supabase
    .from("Users") 
    .update({
      firstName: firstName || null,
      lastName: lastName || null,
      city: city || null,
    })
    .eq("id", session.user.id); 
  
  if (error) {
    document.getElementById("error-msg").textContent =
      "Error updating profile: " + error.message;
  } else {
    document.getElementById("success-msg").textContent =
      "Profile updated successfully!";
  }
});