const { createClient } = window.supabase;


const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk"
const supabase = createClient(supabaseUrl, supabaseKey);


const createBtn = document.getElementById("recCreate");


createBtn?.addEventListener("click", async () => {
  createRecipe().catch((error) => {
    console.log("Error", error);
  });
});


async function createRecipe (){
    const name = document.getElementById("name").value;
    const ingredients = document.getElementById("ingredients").value;
    const instructions = document.getElementById("instructions").value;
    const {data, error} = await supabase.from("recipes").insert([
        {
          name: name,
          ingredients: ingredients,
          instructions: instructions,
        }
      ]).select();
   
      if (error) {
            console.error("Error inserting recipe:", error);
        } else {
            alert("Recipe added!");
            const recipeId = data[0].id;
            saveRecipe(recipeId).catch((error) => {
                console.log("Error", error)
            })
    }
}




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
  const session = await getSession();
  if (!session || !session.user || !session.user.id) {
      console.error("No logged-in user found or user ID is missing.");
      return null;
  }


  try {
      const { data: userProfile, error } = await supabase
          .from("users")
          .select('*')
          .eq('id', session.user.id);


      if (error) {
          console.error("Error fetching user profile:", error);
          return null;
      }


      if (!userProfile || userProfile.length === 0) {
          console.log("No user profile found.");
          return null;
      }


      console.log("User Profile Data:", userProfile);
      return userProfile[0];
  } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      return null;
  }
}






async function saveRecipe(recipe) {
  const userProfile = await getUserProfile();

 
  if (!userProfile) {
      console.error("No logged-in user found. Please log in.");
      return;
  }


  const { error: saveError } = await supabase
      .from("saved_recipes")
      .insert([{
          user_id: userProfile.id,  
          recipe_id: recipe,
      }]);


  if (saveError) {
      console.error("Error saving recipe:", saveError);
  } else {
      console.log("Recipe created and saved successfully!");
  }
}




