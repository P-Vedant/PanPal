
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


getSession().then(session => {
    console.log(session);
}).catch(error => {
    console.log('Error getting session: ', error);
});


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


async function fetchSavedRecipes() {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      console.error("No logged-in user found or user ID is missing.");
      return [];
    }
 
    try {
      const { data: savedRecipeIds, error: savedRecipeError } = await supabase
        .from("saved_recipes")
        .select("recipe_id")
        .eq("user_id", session.user.id);
 
      if (savedRecipeError) {
        console.error("Error fetching saved recipe IDs:", savedRecipeError);
        return [];
      }
 
      if (!savedRecipeIds || savedRecipeIds.length === 0) {
        console.log("No saved recipes found.");
        return [];
      }
      const recipeIds = savedRecipeIds.map(item => item.recipe_id);
 
      const { data: recipes, error: recipeError } = await supabase
        .from("recipes")
        .select("id, name, ingredients, instructions")
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
 
  async function renderSavedRecipes() {
    const savedRecipes = await fetchSavedRecipes();
 
    const recipesContainer = document.getElementById("grid-container");
    if (!recipesContainer) {
      console.error('Element with ID "grid-container" not found.');
      return;
    }
 
    if (savedRecipes.length === 0) {
      recipesContainer.innerHTML = "<p>No saved recipes found.</p>";
      return;
    }
 
    recipesContainer.innerHTML = "";


    savedRecipes.forEach(recipe => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("box");


      recipeDiv.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      `;
      recipesContainer.appendChild(recipeDiv);
    });
  }
 
  document.addEventListener("DOMContentLoaded", function() {
    renderSavedRecipes().catch((error) => {
      console.log('Error rendering saved recipes:', error);
    });
  });
