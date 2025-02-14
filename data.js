const { createClient } = window.supabase;

const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk"
const supabase = createClient(supabaseUrl, supabaseKey);

const updateBtn = document.getElementById("updateBtn");
updateBtn?.addEventListener("click", async () => {
  window.location.href = "update.html";
});

const logoutBtnDisplay = document.getElementById("logoutBtnDisplay");
logoutBtnDisplay?.addEventListener("click", async () => {
  window.location.href = "logout.html";
});

const savedBtn = document.getElementById("viewRecipies");
logoutBtnDisplay?.addEventListener("click", async () => {
  window.location.href = "saved.html";
});


const profileDataDiv = document.getElementById('profile-data');

async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.log("Error getting session:", error);
        return null;
    }
    console.log("Session data:", data); // Log the session data to inspect
    return data.session;  // Ensure session is returned
}

//Call the async function
getSession().then(session => {
    console.log(session);
}).catch(error => {
    console.log('Error getting session: ', error);
});

async function getUserProfile() {
    try {
        // Fetch user profile from the 'Users' table in Supabase
        const { data: userProfile, error } = await supabase.from("table").select('*');

        // Handle any errors that occur during the query
        if (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }

        // If no profiles are found, return null
        if (!userProfile || userProfile.length === 0) {
            console.log("No user profile found.");
            return null;
        }

        console.log("User Profile Data:", userProfile);  // Log the profile data for debugging
        return userProfile;
    } catch (error) {
        // Catch and log any unexpected errors that occur
        console.error("Unexpected error fetching user profile:", error);
        return null;
    }
}


async function fetchProfiles() {
    const session = await getSession();
    console.log("Fetched session:", session);
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

async function setHeader(){
    const session = await getSession()
    if (session){
        const userProfile = await getUserProfile()
        if (userProfile){
            const header = document.getElementById("savedHeader");
            header.textContent = userProfile[0].firstName + "'s Saved Recipies"
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".navbar a");

    // Check for stored active tab in local storage
    let activeTab = localStorage.getItem("activeTab");

    if (activeTab) {
        document.querySelector(`.navbar a[href='${activeTab}']`)?.classList.add("active");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            // Remove 'active' class from all links
            navLinks.forEach(nav => nav.classList.remove("active"));

            // Add 'active' class to the clicked link
            this.classList.add("active");

            // Save active tab in local storage
            localStorage.setItem("activeTab", this.getAttribute("href"));
        });
    });
});

