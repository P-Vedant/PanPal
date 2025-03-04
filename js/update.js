const { createClient } = window.supabase;

const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk"
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

  // Update the user's profile in the table using 'id'
  const { data, error } = await supabase
    .from("users") // Ensure the table name is correct
    .update({
      firstName: firstName || null,
      lastName: lastName || null,
      city: city || null,
    })
    .eq("id", session.user.id); // Use 'id' column to filter
  
  if (error) {
    document.getElementById("error-msg").textContent =
      "Error updating profile: " + error.message;
  } else {
    document.getElementById("success-msg").textContent =
      "Profile updated successfully!";
  }
});