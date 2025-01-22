const { createClient } = window.supabase;

const supabaseUrl = "https://egzhuriimugvkjiauphl.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnemh1cmlpbXVndmtqaWF1cGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzEzNjcsImV4cCI6MjAzOTY0NzM2N30.29e4s0hYCEB3e4m0GDB2WgSpEDbiJSSC4FOg5aU8ZOk";

const supabase = createClient(supabaseUrl, supabaseKey);

const updateBtn = document.getElementById("updateBtn");
updateBtn?.addEventListener("click", async () => {
  window.location.href = "update.html";
});

const logoutBtnDisplay = document.getElementById("logoutBtnDisplay");
logoutBtnDisplay?.addEventListener("click", async () => {
  window.location.href = "logout.html";
});

const profileDataDiv = document.getElementById('profile-data');

async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log("Error getting session:", error);
    return null;
  }
  console.log("Session data:", data); // Log the session data
  return data.session;
}

//Call the async function
getSession().then(session => {
    console.log(session);
}).catch(error => {
    console.log('Error getting session: ', error);
});

async function getUserProfile() {
    const {data: userProfile, error} = await supabase.from("Users").select('*');

    if (error){
        document.getElementById("error-msg").textContent = error.message;
        console.log('Error getting user profile: ', error);
        return null;
    }

    return userProfile;
}

async function fetchProfiles() {
    const session = await getSession();
    if (session) {
        const userProfile = await getUserProfile();
        if (userProfile) {
            console.log('User Profile', userProfile);
            profileDataDiv.innerHTML = `
                <p><strong>First Name:</strong> ${userProfile[0].firstName}</p>
                <p><strong>Last Name:</strong> ${userProfile[0].lastName}</p>
                <p><strong>City:</strong> ${userProfile[0].city}</p>
                <p><strong>Email:</strong> ${userProfile[0].email}</p>`;
        }
    } else {
        console.log('No active session found');
    }
}

fetchProfiles().catch((error) => {
    console.log('Error', error);
})