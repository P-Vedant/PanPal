const { createClient } = window.supabase;

const supabaseUrl = "https://skkarudeuhrkxffznamx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNra2FydWRldWhya3hmZnpuYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjgxOTMsImV4cCI6MjA1MzA0NDE5M30.qf4efYl7CT61AvVnZJ833YVtKrLzPD2IApcg4e4GoXM";

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