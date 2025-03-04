const { createClient } = window.supabase;

const supabaseUrl = "https://bhfttxqkobtckescbnyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnR0eHFrb2J0Y2tlc2Nibnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODY3OTEsImV4cCI6MjA0MzM2Mjc5MX0.xrOUNxM4tchKJHCTiEKhcM-kH1k0nTmJh9gNvMp5dOk";
const supabase = createClient(supabaseUrl, supabaseKey);

const createBtn = document.getElementById("createBtn");
createBtn?.addEventListener("click", async () => {
  createRecipe().catch((error) => {
    console.log("Error", error);
  });
});

const addIntructBtn = document.getElementById("add-instructions");
const addIngredBtn = document.getElementById("add-ingredients");

const ingredients = [];
const instructions = [];

addIntructBtn?.addEventListener("click", async () => {
  const instruction = document.getElementById("instructions").value;
  if (!instruction) {
    alert("Please fill out the instruction field.");
    return;
  }
  instructions.push(instruction);
  document.getElementById("instructions").value = "";
  console.log("Instructions:", instructions);
});

addIngredBtn?.addEventListener("click", async () => {
  ingredient = document.getElementById("ingredients").value;
  if (!ingredient) {
    alert("Please fill out the ingredient field.");
    return;
  }
  ingredients.push(ingredient);
  document.getElementById("ingredients").value = "";
  console.log("Ingredients:", ingredients);
});



async function createRecipe() {
  const name = document.getElementById("name").value;
  const fileInput = document.getElementById("recipe-image");
  const file = fileInput.files[0];

  if (!name || !ingredients || !instructions) {
    alert("Please fill out all fields.");
    return;
  }

  let imageURL = null;
  if (file) {
    console.log("Uploading image...");
    imageURL = await uploadImage(file);
    if (!imageURL) {
      alert("Error uploading image. Please try again.");
      return;
    } else {
      console.log("Image URL successfully generated:", imageURL);
    }
  }

  const { data, error } = await supabase
  .from("recipes")
  .insert([{
    name: name,
    ingredients: ingredients,
    instructions: instructions,
    imageURL: imageURL
  }]).select();

  if (error) {
    console.error("Error inserting recipe:", error);
  } else {
    alert("Recipe added!");
    const recipeId = data[0].id;
    saveRecipe(recipeId).catch((error) => {
      console.log("Error", error);
    });
  }
}

async function uploadImage(file) {
    const filePath = `recipes/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('images').upload(filePath, file);

    if (error) {
        console.error("Error uploading image:", error);
        return null;
    }
    
    const { data: publicData, error: urlError } = supabase
    .storage
    .from('images')
    .getPublicUrl(filePath)


    if (urlError) {
        console.error("Error retrieving public URL:", urlError);
        return null;
    }

    console.log("Public URL:", publicData.publicUrl);  // You should see the correct URL now
    return publicData.publicUrl;
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
  window.location.href = "../html/saved.html";
  if (saveError) {
    console.error("Error saving recipe:", saveError);
  } else {
    console.log("Recipe created and saved successfully!");
  }
}