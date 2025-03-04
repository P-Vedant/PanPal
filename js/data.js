
const { createClient } = window.supabase;


const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk"
const supabase = createClient(supabaseUrl, supabaseKey);


const updateBtn = document.getElementById("updateBtn");
updateBtn?.addEventListener("click", async () => {
  window.location.href = "update.html";
});

/* Log Out User */
const logoutBtnDisplay = document.getElementById("logoutBtnDisplay");
logoutBtnDisplay?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error logging out:", error);
    return;
  }
  window.location.href = "logout.html";
});

const profileDataDiv = document.getElementById('profile-data');

async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.log("Error getting session:", error);
        return null;
    }
    console.log("Session data:", data);
    return data.session;
}

async function getUserProfile() {
    try {
        const { data: userProfile, error } = await supabase.from("users").select('*');


        if (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }


        if (!userProfile || userProfile.length === 0) {
            console.log("No user profile found.");
            return null;
        }


        console.log("User Profile Data:", userProfile);
        return userProfile;
    } catch (error) {
        console.error("Unexpected error fetching user profile:", error);
        return null;
    }
}

/* Display User Data*/
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

/* Getting User Specific Recipes*/
async function fetchSavedRecipes() {
  /* Ensures There Is a User to Fetch Recipes From */
  const session = await getSession();
  const userId = session.user.id

  if (!session || !session.user || !userId) {
    console.error("No logged-in user found or user ID is missing.");
    return [];
  }

  try {
    /* Returns Row Conating Recipe ID with Mathcing User ID */
    const { data: savedRecipeIds, error: savedRecipeError } = await supabase
      .from("saved_recipes")
      .select("recipe_id")
      .eq("user_id", userId);

    if (savedRecipeError) {
      console.error("Error fetching saved recipe IDs:", savedRecipeError);
      return [];
    }
 
    if (!savedRecipeIds || savedRecipeIds.length === 0) {
      console.log("No saved recipes found.");
      return [];
    }
    /* Creates Array Exclusivly Containging the Recipe IDs */
    const recipeIds = savedRecipeIds.map(item => item.recipe_id);

    /* Createas a New Array Containing All the Information for Each Recipe Based on 'recipeIds' ID List */
    const { data: recipes, error: recipeError } = await supabase
      .from("recipes")
      .select("id, name, ingredients, instructions, imageURL")
      .in("id", recipeIds);

    if (recipeError) {
      console.error("Error fetching recipe details:", recipeError);
      return [];
    }
 
    return recipes;
  } catch (error) {
    console.error("Unexpected error fetching saved recipes:", error);
    return [];
  }
}

/* Displays Each Saved Recipe */
async function renderSavedRecipes() {
  const savedRecipes = await fetchSavedRecipes();
  const recipesContainer = document.getElementById("grid-container");
  
  /* Ensures the Div Element Exists and User Posseses At Least One Saved Recipe */
  if (!recipesContainer) {
    console.error('Element with ID "grid-container" not found.');
    return;
  }
  if (savedRecipes.length === 0) {
    recipesContainer.innerHTML = "<p>No saved recipes found.</p>";
    return;
  }
  /* Resets All Elements Left Prior */
  recipesContainer.innerHTML = "";

  /* For Each Object in 'savedRecipes', Creates a New Div Element Under the Class Name 'box' and Sets the Contents to the Associated Image and Name and Adds to the General Container */
  savedRecipes.forEach(recipe => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("box");
    recipeDiv.innerHTML = `
    <img src="${recipe.imageURL}" alt="${recipe.name}">  
    <h3>${recipe.name}</h3>
    `;
    recipesContainer.appendChild(recipeDiv);
  });
}

/* Checks Logged In Status*/
async function isLoggedIn() {
  /* Check for Auth User and Returns to Login Screen If Not */
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      window.location.href = "index.html";
    }
  }).catch(error => {
    console.log('Error getting user: ', error);
  });
}

/* Navigation Bar */
document.addEventListener("DOMContentLoaded", function() { //Navigation bar
  const navLinks = document.querySelectorAll(".navbar a");
  let activeTab = localStorage.getItem("activeTab");


  if (activeTab) {
      document.querySelector(`.navbar a[href='${activeTab}']`)?.classList.add("active");
  }


  navLinks.forEach(link => {
      link.addEventListener("click", function() {
          navLinks.forEach(nav => nav.classList.remove("active"));
          this.classList.add("active");
          localStorage.setItem("activeTab", this.getAttribute("href"));
      });
  });


  const newRec = document.getElementById("newRec");
      newRec?.addEventListener("click", async () => {
           window.location.href = "create.html";
  });
});

/* Run Functions for Saved Recipes */
if (window.location.pathname.includes("/saved.html")) {

  isLoggedIn().catch((error) => {
    console.log('Error checking if user is logged in:', error);
  });

  document.addEventListener("DOMContentLoaded", function() {
    renderSavedRecipes().catch((error) => {
    console.log('Error rendering saved recipes:', error);
    });
  });
}

/* Run Functions for Displaying Profile */
if (window.location.pathname.includes("/profile.html") ) {

  isLoggedIn().catch((error) => {
    console.log('Error checking if user is logged in:', error);
  });

  console.log("Fetching profiles...");
  fetchProfiles().catch((error) => {
    console.log('Error', error);
})
}

/* Run Functions for Suggested Recipes */
if (window.location.pathname.includes("/suggest.html") ) {

  isLoggedIn().catch((error) => {
    console.log('Error checking if user is logged in:', error);
  });
}

/* Run Functions for Home Page */
if (window.location.pathname.includes("/display.html") ) {

  isLoggedIn().catch((error) => {
    console.log('Error checking if user is logged in:', error);
  });
}

