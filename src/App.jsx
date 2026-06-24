import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const recipeDatabase = [
  {
    name: "Chicken vegetable soup",
    mealType: "Lunch",
    image: "/images/chicken-soup.jpg",
    tags: ["weight_loss", "high_protein", "fatty_liver", "insulin_resistance", "slow_metabolism", "high_blood_pressure"],
    allergens: ["celery"],
    cookedWeightG: 2500,
    portionG: 400,
    ingredients: [
      { name: "Chicken breast", grams: 500, calories: 165, protein: 31, carbs: 0, fats: 3.6 },
      { name: "Potatoes", grams: 300, calories: 77, protein: 2, carbs: 17, fats: 0.1 },
      { name: "Carrots", grams: 200, calories: 41, protein: 0.9, carbs: 10, fats: 0.2 },
      { name: "Onion", grams: 100, calories: 40, protein: 1.1, carbs: 9, fats: 0.1 },
      { name: "Celery", grams: 100, calories: 14, protein: 0.7, carbs: 3, fats: 0.2 },
      { name: "Olive oil", grams: 15, calories: 884, protein: 0, carbs: 0, fats: 100 },
    ],
  },
  {
    name: "Greek yogurt oats bowl",
    mealType: "Breakfast",
    image: "/images/yogurt-oats.jpg",
    tags: ["weight_loss", "high_protein", "fatty_liver", "insulin_resistance", "slow_metabolism", "high_cholesterol"],
    allergens: ["milk", "gluten"],
    cookedWeightG: 350,
    portionG: 350,
    ingredients: [
      { name: "Greek yogurt", grams: 200, calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
      { name: "Oats", grams: 50, calories: 389, protein: 17, carbs: 66, fats: 7 },
      { name: "Banana", grams: 100, calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
    ],
  },
  {
    name: "Chicken rice bowl",
    mealType: "Dinner",
    image: "/images/chicken-rice.jpg",
    tags: ["weight_loss", "high_protein", "fatty_liver", "insulin_resistance", "slow_metabolism"],
    allergens: [],
    cookedWeightG: 550,
    portionG: 550,
    ingredients: [
      { name: "Chicken breast", grams: 200, calories: 165, protein: 31, carbs: 0, fats: 3.6 },
      { name: "Cooked rice", grams: 180, calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
      { name: "Mixed vegetables", grams: 150, calories: 50, protein: 2, carbs: 10, fats: 0.5 },
      { name: "Olive oil", grams: 10, calories: 884, protein: 0, carbs: 0, fats: 100 },
    ],
  },
  {
    name: "Turkey salad wrap",
    mealType: "Lunch",
    image: "/images/turkey-wrap.jpg",
    tags: ["weight_loss", "high_protein", "insulin_resistance", "high_cholesterol"],
    allergens: ["gluten"],
    cookedWeightG: 360,
    portionG: 360,
    ingredients: [
      { name: "Turkey breast", grams: 150, calories: 135, protein: 29, carbs: 0, fats: 1 },
      { name: "Wholemeal wrap", grams: 70, calories: 300, protein: 9, carbs: 48, fats: 7 },
      { name: "Salad", grams: 100, calories: 20, protein: 1, carbs: 4, fats: 0 },
      { name: "Greek yogurt sauce", grams: 40, calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
    ],
  },
  {
    name: "Salmon vegetables plate",
    mealType: "Dinner",
    image: "/images/salmon-veg.jpg",
    tags: ["weight_loss", "high_protein", "fatty_liver", "high_cholesterol", "high_blood_pressure"],
    allergens: ["fish"],
    cookedWeightG: 430,
    portionG: 430,
    ingredients: [
      { name: "Salmon", grams: 170, calories: 208, protein: 20, carbs: 0, fats: 13 },
      { name: "Broccoli", grams: 150, calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
      { name: "Sweet potato", grams: 100, calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
      { name: "Olive oil", grams: 10, calories: 884, protein: 0, carbs: 0, fats: 100 },
    ],
  },
  {
    name: "Egg vegetable omelette",
    mealType: "Breakfast",
    image: "/images/omelette.jpg",
    tags: ["weight_loss", "high_protein", "insulin_resistance", "slow_metabolism"],
    allergens: ["eggs"],
    cookedWeightG: 330,
    portionG: 330,
    ingredients: [
      { name: "Eggs", grams: 150, calories: 143, protein: 13, carbs: 1.1, fats: 9.5 },
      { name: "Mushrooms", grams: 80, calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3 },
      { name: "Spinach", grams: 50, calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
      { name: "Olive oil", grams: 5, calories: 884, protein: 0, carbs: 0, fats: 100 },
    ],
  },
];

const foodDatabase = [
  { barcode: "500000000001", food_name: "Chicken breast 200g", meal_type: "Food Search", calories: 330, protein_g: 62, carbs_g: 0, fats_g: 7 },
  { barcode: "500000000002", food_name: "Greek yogurt 200g", meal_type: "Food Search", calories: 118, protein_g: 20, carbs_g: 7, fats_g: 1 },
  { barcode: "500000000003", food_name: "Cooked rice 180g", meal_type: "Food Search", calories: 234, protein_g: 5, carbs_g: 50, fats_g: 1 },
  { barcode: "500000000004", food_name: "Banana medium", meal_type: "Food Search", calories: 105, protein_g: 1, carbs_g: 27, fats_g: 0 },
  { barcode: "500000000005", food_name: "Protein shake", meal_type: "Food Search", calories: 150, protein_g: 25, carbs_g: 5, fats_g: 3 },
  { barcode: "500000000006", food_name: "Salmon fillet 170g", meal_type: "Food Search", calories: 354, protein_g: 34, carbs_g: 0, fats_g: 22 },
  { barcode: "500000000007", food_name: "Mixed vegetables 150g", meal_type: "Food Search", calories: 75, protein_g: 3, carbs_g: 15, fats_g: 1 },
  { barcode: "500000000008", food_name: "Oats 50g", meal_type: "Food Search", calories: 195, protein_g: 9, carbs_g: 33, fats_g: 4 },
];

const healthOptions = [
  { key: "fatty_liver", label: "Fatty liver" },
  { key: "insulin_resistance", label: "Insulin resistance" },
  { key: "slow_metabolism", label: "Slow metabolism / low energy" },
  { key: "high_blood_pressure", label: "High blood pressure" },
  { key: "high_cholesterol", label: "High cholesterol" },
  { key: "type_2_diabetes", label: "Type 2 diabetes" },
  { key: "acid_reflux", label: "Acid reflux" },
  { key: "kidney_problems", label: "Kidney problems" },
];

const allergenOptions = ["nuts", "peanuts", "milk", "eggs", "gluten", "fish", "shellfish", "soy", "sesame", "celery", "mustard", "sulphites"];

const defaultMealTimes = [
  { name: "Breakfast", time: "08:00" },
  { name: "Snack", time: "11:00" },
  { name: "Lunch", time: "13:00" },
  { name: "Snack", time: "16:30" },
  { name: "Dinner", time: "18:30" },
];

const defaultExercises = [
  { name: "10 minute walk", duration: 10 },
  { name: "Chair squats", duration: 5 },
  { name: "Wall push-ups", duration: 5 },
  { name: "Light stretching", duration: 5 },
];

const nonScaleVictoryOptions = [
  "Better energy today",
  "Less bloating",
  "Better sleep",
  "Completed walk",
  "Stayed on meal plan",
  "Drank enough water",
];

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "linear-gradient(rgba(2,6,23,0.70), rgba(2,6,23,0.90)), url('/images/healthy-background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    padding: "clamp(14px, 4vw, 30px)",
  },
  shell: { maxWidth: 1400, margin: "0 auto" },
  card: {
    background: "rgba(15,23,42,0.94)",
    border: "1px solid rgba(56,189,248,0.28)",
    borderRadius: 28,
    padding: "24px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(12px)",
    color: "#ffffff",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.35)",
    background: "rgba(2,6,23,0.65)",
    color: "#f8fafc",
    boxSizing: "border-box",
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 15,
  },
  smallButton: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  heading: { color: "#ffffff", fontWeight: 800 },
  muted: { color: "#cbd5e1" },
};

function calculateRecipe(recipe) {
  const total = recipe.ingredients.reduce(
    (acc, item) => {
      acc.calories += (item.grams / 100) * item.calories;
      acc.protein += (item.grams / 100) * item.protein;
      acc.carbs += (item.grams / 100) * item.carbs;
      acc.fats += (item.grams / 100) * item.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const ratio = recipe.portionG / recipe.cookedWeightG;

  return {
    calories: Math.round(total.calories * ratio),
    protein: Math.round(total.protein * ratio),
    carbs: Math.round(total.carbs * ratio),
    fats: Math.round(total.fats * ratio),
  };
}

function calculateTargets(profile, latestWeight, workDay, medication, healthProfile) {
  if (!profile) return null;

  const weight = Number(latestWeight || profile.starting_weight_kg || 0);
  const height = Number(profile.height_cm || 170);
  const age = Number(profile.age || 30);

  const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  let activityMultiplier = 1.2;
  if (workDay?.jobActivity === "standing") activityMultiplier = 1.35;
  if (workDay?.jobActivity === "physical") activityMultiplier = 1.55;

  const tdee = Math.round(bmr * activityMultiplier);
  let calorieTarget = Math.max(1800, tdee - 500);
  if (medication === "mounjaro") calorieTarget -= 200;
  if (medication === "semaglutide") calorieTarget -= 150;
  calorieTarget = Math.max(1600, Math.round(calorieTarget));

  let carbPercent = 0.4;
  let fatPercent = 0.3;
  if (healthProfile?.insulin_resistance || healthProfile?.fatty_liver || healthProfile?.type_2_diabetes) {
    carbPercent = 0.3;
    fatPercent = 0.35;
  }

  const proteinG = Math.round(Math.min(Math.max(weight * 0.9, 90), 170));
  const caloriesAfterProtein = Math.max(calorieTarget - proteinG * 4, 0);
  const carbsG = Math.round((caloriesAfterProtein * (carbPercent / (carbPercent + fatPercent))) / 4);
  const fatsG = Math.round((caloriesAfterProtein * (fatPercent / (carbPercent + fatPercent))) / 9);

  return { bmr, tdee, calorieTarget, proteinG, carbsG, fatsG };
}

function todayOnly(logs) {
  const today = new Date().toDateString();
  return logs.filter((log) => log.logged_at && new Date(log.logged_at).toDateString() === today);
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hasProfile, setHasProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [weightLogs, setWeightLogs] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [newWeight, setNewWeight] = useState("");

  const [customMeal, setCustomMeal] = useState({
    food_name: "",
    meal_type: "Homemade",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fats_g: "",
  });

  const [editingMealId, setEditingMealId] = useState(null);
  const [editMeal, setEditMeal] = useState({ food_name: "", calories: "", protein_g: "", carbs_g: "", fats_g: "" });

  const [foodSearch, setFoodSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [barcodeMessage, setBarcodeMessage] = useState("Barcode scanner uses the browser BarcodeDetector when available. You can also type a barcode manually.");
  const [recipeIdea, setRecipeIdea] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    height_cm: "",
    starting_weight_kg: "",
    target_weight_kg: "",
    activity_level: "sedentary",
  });

  const [healthProfile, setHealthProfile] = useState(() => JSON.parse(localStorage.getItem("healthProfile")) || {});
  const [allergens, setAllergens] = useState(() => JSON.parse(localStorage.getItem("allergens")) || []);
  const [mealTimes, setMealTimes] = useState(() => JSON.parse(localStorage.getItem("mealTimes")) || defaultMealTimes);
  const [completedExercises, setCompletedExercises] = useState(() => JSON.parse(localStorage.getItem("completedExercises")) || {});
  const [victories, setVictories] = useState(() => JSON.parse(localStorage.getItem("victories")) || {});
  const [water, setWater] = useState({});

  const [workDay, setWorkDay] = useState({ shiftType: "day_shift", shiftLength: "12", jobActivity: "sitting", energy: "low" });
  const [medication, setMedication] = useState("none");
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [photoNote, setPhotoNote] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [feedback, setFeedback] = useState({ ease: "", wouldUse: "", add: "", confusing: "" });
  const [coachMessage, setCoachMessage] = useState("You have already completed the hardest step — making the decision to change. Every healthy meal, every walk, and every positive choice brings you closer to your future self.");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) initApp(session.user.id);
      else setCheckingProfile(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) initApp(session.user.id);
      else {
        setHasProfile(false);
        setUserProfile(null);
        setMealLogs([]);
        setWeightLogs([]);
        setProgressPhotos([]);
        setCheckingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => localStorage.setItem("healthProfile", JSON.stringify(healthProfile)), [healthProfile]);
  useEffect(() => localStorage.setItem("allergens", JSON.stringify(allergens)), [allergens]);
  useEffect(() => localStorage.setItem("mealTimes", JSON.stringify(mealTimes)), [mealTimes]);
  useEffect(() => localStorage.setItem("completedExercises", JSON.stringify(completedExercises)), [completedExercises]);
  useEffect(() => localStorage.setItem("victories", JSON.stringify(victories)), [victories]);


  async function initApp(userId) {
    setCheckingProfile(true);
    await Promise.all([fetchUserProfile(userId), fetchWeightLogs(userId), fetchMealLogs(userId), fetchWaterLogs(userId), fetchProgressPhotos(userId)]);
    setCheckingProfile(false);
  }

  async function fetchUserProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (data) {
      setHealthProfile(data.health_profile || {});
      setAllergens(data.allergens || []);
      setWorkDay(data.work_day || { shiftType: "day_shift", shiftLength: "12", jobActivity: "sitting", energy: "low" });
      setMedication(data.medication || "none");
      setMealTimes(data.meal_times || defaultMealTimes);
      setUserProfile(data);
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  }

  async function fetchWeightLogs(userId) {
    const { data } = await supabase.from("weight_logs").select("*").eq("user_id", userId).order("logged_at", { ascending: true });
    setWeightLogs(data || []);
  }

  async function fetchMealLogs(userId) {
    const { data } = await supabase.from("meal_logs").select("*").eq("user_id", userId).order("logged_at", { ascending: false });
    setMealLogs(data || []);
  }

  async function fetchWaterLogs(userId) {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.from("water_logs").select("*").eq("user_id", userId).eq("logged_date", today);
    if (error) return;
    const savedWater = {};
    (data || []).forEach((log) => { savedWater[log.glass_number] = log.completed; });
    setWater(savedWater);
  }

  async function fetchProgressPhotos(userId) {
    const { data, error } = await supabase.from("progress_photos").select("*").eq("user_id", userId).order("uploaded_at", { ascending: false });
    if (error) return;
    setProgressPhotos(data || []);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    const response = isSignUp ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
    if (response.error) alert(response.error.message);
    setLoading(false);
  }

  async function handleOnboardingSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      id: session.user.id,
      full_name: formData.full_name,
      age: Number(formData.age),
      height_cm: Number(formData.height_cm),
      starting_weight_kg: Number(formData.starting_weight_kg),
      target_weight_kg: Number(formData.target_weight_kg),
      activity_level: formData.activity_level,
      health_profile: healthProfile,
      allergens,
      work_day: workDay,
      medication,
      meal_times: mealTimes,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").insert([payload]);
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("weight_logs").insert([{ user_id: session.user.id, weight_kg: Number(formData.starting_weight_kg) }]);
    await initApp(session.user.id);
    setLoading(false);
  }

  async function saveUserSettings() {
    const { error } = await supabase.from("profiles").update({
      health_profile: healthProfile,
      allergens,
      work_day: workDay,
      medication,
      meal_times: mealTimes,
      updated_at: new Date().toISOString(),
    }).eq("id", session.user.id);
    alert(error ? error.message : "Settings saved");
  }

  async function insertMeal(meal) {
    if (!session?.user?.id) return;
    const { error } = await supabase.from("meal_logs").insert([{ user_id: session.user.id, ...meal }]);
    if (error) alert(error.message);
    else fetchMealLogs(session.user.id);
  }

  async function logRecipe(recipe) {
    const calc = calculateRecipe(recipe);
    await insertMeal({ food_name: recipe.name, meal_type: recipe.mealType, calories: calc.calories, protein_g: calc.protein, carbs_g: calc.carbs, fats_g: calc.fats });
  }

  async function addCustomMeal(e) {
    e.preventDefault();
    await insertMeal({
      food_name: customMeal.food_name,
      meal_type: customMeal.meal_type,
      calories: Number(customMeal.calories || 0),
      protein_g: Number(customMeal.protein_g || 0),
      carbs_g: Number(customMeal.carbs_g || 0),
      fats_g: Number(customMeal.fats_g || 0),
    });
    setCustomMeal({ food_name: "", meal_type: "Homemade", calories: "", protein_g: "", carbs_g: "", fats_g: "" });
  }

  function startEditMeal(meal) {
    setEditingMealId(meal.id);
    setEditMeal({
      food_name: meal.food_name || "",
      calories: meal.calories || "",
      protein_g: meal.protein_g || "",
      carbs_g: meal.carbs_g || "",
      fats_g: meal.fats_g || "",
    });
  }

  async function saveEditedMeal(mealId) {
    const { error } = await supabase.from("meal_logs").update({
      food_name: editMeal.food_name,
      calories: Number(editMeal.calories || 0),
      protein_g: Number(editMeal.protein_g || 0),
      carbs_g: Number(editMeal.carbs_g || 0),
      fats_g: Number(editMeal.fats_g || 0),
    }).eq("id", mealId).eq("user_id", session.user.id);

    if (error) alert(error.message);
    else {
      setEditingMealId(null);
      fetchMealLogs(session.user.id);
    }
  }

  async function deleteMeal(mealId) {
    const { error } = await supabase.from("meal_logs").delete().eq("id", mealId).eq("user_id", session.user.id);
    if (error) alert(error.message);
    else fetchMealLogs(session.user.id);
  }

  async function handleLogWeightSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from("weight_logs").insert([{ user_id: session.user.id, weight_kg: Number(newWeight) }]);
    if (error) alert(error.message);
    else {
      setNewWeight("");
      fetchWeightLogs(session.user.id);
    }
  }

  function toggleAllergen(item) { setAllergens((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]); }
  function updateHealth(key) { setHealthProfile((prev) => ({ ...prev, [key]: !prev[key] })); }
  function updateMealTime(index, field, value) { const copy = [...mealTimes]; copy[index][field] = value; setMealTimes(copy); }
  function toggleExercise(name) { setCompletedExercises((prev) => ({ ...prev, [name]: !prev[name] })); }
  function toggleVictory(name) { setVictories((prev) => ({ ...prev, [name]: !prev[name] })); }

  async function toggleWater(index) {
    const today = new Date().toISOString().split("T")[0];
    const currentlyDone = !!water[index];
    setWater((prev) => ({ ...prev, [index]: !currentlyDone }));
    if (currentlyDone) {
      await supabase.from("water_logs").delete().eq("user_id", session.user.id).eq("glass_number", index).eq("logged_date", today);
    } else {
      await supabase.from("water_logs").insert([{ user_id: session.user.id, glass_number: index, logged_date: today, completed: true }]);
    }
  }


  async function uploadProgressPhoto() {
    if (!selectedPhoto) return alert("Please choose a photo first");
    if (!session?.user?.id) return alert("You must be signed in to upload photos");
    const cleanName = selectedPhoto.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${session.user.id}/${Date.now()}-${cleanName}`;
    const { error: uploadError } = await supabase.storage.from("progress-photos").upload(filePath, selectedPhoto);
    if (uploadError) return alert(uploadError.message);
    const { data } = supabase.storage.from("progress-photos").getPublicUrl(filePath);
    const { error: insertError } = await supabase.from("progress_photos").insert([{ user_id: session.user.id, photo_url: data.publicUrl, note: photoNote || "Progress photo" }]);
    if (insertError) return alert(insertError.message);
    setPhotoNote("");
    setSelectedPhoto(null);
    await fetchProgressPhotos(session.user.id);
    alert("Photo uploaded");
  }

  function submitFeedback(e) {
    e.preventDefault();
    alert("Thank you. Feedback saved for this session.");
    setFeedback({ ease: "", wouldUse: "", add: "", confusing: "" });
  }

  function generateCoachMessage() {
    const messages = [
      "Progress is not measured by perfection. It is measured by the choices you make today.",
      "For fatty liver and insulin resistance, focus on protein, vegetables, fibre, lower sugar, and steady daily movement.",
      "The future version of you is built by the choices you make right now.",
      "You do not need to be perfect today. You only need to keep going.",
    ];

    setCoachMessage(messages[Math.floor(Math.random() * messages.length)]);
  }

  function findBarcodeFood(code) {
    const item = foodDatabase.find((food) => food.barcode === code.trim());
    if (!item) {
      setBarcodeMessage("Barcode not found in the demo database. Add it manually as a homemade meal or add it to foodDatabase.");
      return;
    }
    setBarcodeMessage(`Found: ${item.food_name}`);
    setCustomMeal({
      food_name: item.food_name,
      meal_type: item.meal_type,
      calories: String(item.calories),
      protein_g: String(item.protein_g),
      carbs_g: String(item.carbs_g),
      fats_g: String(item.fats_g),
    });
  }

  async function scanBarcodeFromImage(file) {
    if (!file) return;
    if (!("BarcodeDetector" in window)) {
      setBarcodeMessage("This browser does not support automatic barcode scanning yet. Type the barcode manually.");
      return;
    }

    try {
      const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
      const bitmap = await createImageBitmap(file);
      const barcodes = await detector.detect(bitmap);
      if (!barcodes.length) {
        setBarcodeMessage("No barcode detected. Try a clearer photo or type it manually.");
        return;
      }
      const foundCode = barcodes[0].rawValue;
      setBarcode(foundCode);
      findBarcodeFood(foundCode);
    } catch (error) {
      setBarcodeMessage("Could not scan barcode on this browser. Type it manually instead.");
    }
  }

  function generateRecipeIdea() {
    const text = recipeIdea.toLowerCase();
    const hasChicken = text.includes("chicken");
    const hasEgg = text.includes("egg");
    const hasYogurt = text.includes("yogurt") || text.includes("yoghurt");
    const lowCarb = healthProfile.insulin_resistance || healthProfile.type_2_diabetes;

    let recipe = {
      name: "Balanced protein bowl",
      calories: 430,
      protein_g: 38,
      carbs_g: lowCarb ? 28 : 45,
      fats_g: 14,
      instructions: "Use a lean protein, vegetables, and a controlled carbohydrate portion. Keep sauces light and avoid added sugar.",
    };

    if (hasChicken) recipe = { name: "AI chicken vegetable plate", calories: 480, protein_g: 50, carbs_g: lowCarb ? 25 : 45, fats_g: 12, instructions: "Grill or air-fry chicken, add vegetables, and use rice or potato only in a measured portion." };
    if (hasEgg) recipe = { name: "AI egg vegetable omelette", calories: 360, protein_g: 28, carbs_g: 10, fats_g: 22, instructions: "Make an omelette with vegetables. Add salad on the side. Avoid too much oil." };
    if (hasYogurt) recipe = { name: "AI yogurt protein bowl", calories: 330, protein_g: 30, carbs_g: 35, fats_g: 6, instructions: "Use Greek yogurt, a small portion of oats or berries, and avoid added sugar." };

    setGeneratedRecipe(recipe);
  }

  function addGeneratedRecipe() {
    if (!generatedRecipe) return;
    insertMeal({
      food_name: generatedRecipe.name,
      meal_type: "AI Recipe",
      calories: generatedRecipe.calories,
      protein_g: generatedRecipe.protein_g,
      carbs_g: generatedRecipe.carbs_g,
      fats_g: generatedRecipe.fats_g,
    });
  }

  const currentWeight = weightLogs.length ? Number(weightLogs[weightLogs.length - 1].weight_kg) : Number(userProfile?.starting_weight_kg || 0);
  const targets = useMemo(() => calculateTargets(userProfile, currentWeight, workDay, medication, healthProfile), [userProfile, currentWeight, workDay, medication, healthProfile]);
  const todaysMeals = useMemo(() => todayOnly(mealLogs), [mealLogs]);

  const consumedToday = useMemo(() => todaysMeals.reduce((acc, log) => {
    acc.calories += Number(log.calories) || 0;
    acc.protein += Number(log.protein_g) || 0;
    acc.carbs += Number(log.carbs_g) || 0;
    acc.fats += Number(log.fats_g) || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 }), [todaysMeals]);

  const suggestedRecipes = useMemo(() => {
    const activeHealth = Object.keys(healthProfile).filter((key) => healthProfile[key]);

    return recipeDatabase.filter((recipe) => {
      const blockedByAllergy = recipe.allergens.some((a) => allergens.includes(a));
      if (blockedByAllergy) return false;
      if (activeHealth.length === 0) return true;
      return activeHealth.some((condition) => recipe.tags.includes(condition));
    });
  }, [healthProfile, allergens]);

  const searchedFoods = useMemo(() => {
    const q = foodSearch.toLowerCase().trim();
    if (!q) return foodDatabase;
    return foodDatabase.filter((food) => food.food_name.toLowerCase().includes(q) || food.barcode.includes(q));
  }, [foodSearch]);

  const weeklyMealPlan = useMemo(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const recipes = suggestedRecipes.length ? suggestedRecipes : recipeDatabase;
    return days.map((day, index) => ({
      day,
      breakfast: recipes.find((r) => r.mealType === "Breakfast") || recipes[index % recipes.length],
      lunch: recipes.find((r) => r.mealType === "Lunch") || recipes[(index + 1) % recipes.length],
      dinner: recipes.find((r) => r.mealType === "Dinner") || recipes[(index + 2) % recipes.length],
    }));
  }, [suggestedRecipes]);

  const shoppingList = useMemo(() => {
    const totals = {};
    weeklyMealPlan.forEach((day) => {
      [day.breakfast, day.lunch, day.dinner].forEach((recipe) => {
        if (!recipe?.ingredients) return;
        recipe.ingredients.forEach((item) => { totals[item.name] = (totals[item.name] || 0) + item.grams; });
      });
    });
    return Object.entries(totals).map(([name, grams]) => ({ name, grams }));
  }, [weeklyMealPlan]);

  const startWeight = Number(userProfile?.starting_weight_kg || currentWeight);
  const goalWeight = Number(userProfile?.target_weight_kg || 0);

  const weightLost = Math.max(startWeight - currentWeight, 0);
  const weightRemaining = Math.max(currentWeight - goalWeight, 0);
  const totalJourney = Math.max(startWeight - goalWeight, 1);
  const progressPercent = Math.min(Math.round((weightLost / totalJourney) * 100), 100);

  const caloriesLeft = targets ? targets.calorieTarget - Math.round(consumedToday.calories) : 0;

  const exerciseDone = defaultExercises.filter((x) => completedExercises[x.name]).length;
  const victoriesDone = nonScaleVictoryOptions.filter((x) => victories[x]).length;
  const waterDone = Object.values(water).filter(Boolean).length;

  function getAdaptiveMission() {
    if (workDay.shiftType === "night_shift" && workDay.energy === "low") {
      return [
        { label: "Drink at least 6 glasses of water", done: waterDone >= 6 },
        { label: "Eat 2 protein-based meals", done: todaysMeals.length >= 2 },
        { label: "Do 5 minutes stretching", done: exerciseDone >= 1 },
        { label: "Avoid sugary snacks during shift", done: !!victories["Stayed on meal plan"] },
      ];
    }

    if (workDay.shiftType === "day_shift" && workDay.shiftLength === "12") {
      return [
        { label: "Drink 8 glasses of water", done: waterDone >= 8 },
        { label: "Log at least 2 meals", done: todaysMeals.length >= 2 },
        { label: "Do one light movement break", done: exerciseDone >= 1 },
        { label: "Stay within calorie target", done: caloriesLeft >= 0 && consumedToday.calories > 0 },
      ];
    }
    

    return [
      { label: "Stay within calorie target", done: caloriesLeft >= 0 && consumedToday.calories > 0 },
      { label: "Drink 8 glasses of water", done: waterDone >= 8 },
      { label: "Complete daily exercise", done: exerciseDone >= 1 },
      { label: "Log at least one meal", done: todaysMeals.length > 0 },
    ];
  }

  const missionItems = getAdaptiveMission();
  const missionDone = missionItems.filter((x) => x.done).length;

  function getMedicationAdvice() {
    if (medication === "mounjaro") return ["Protein first, because appetite may be lower.", "Use smaller meals instead of large plates.", "Drink water regularly through the day.", "Avoid very greasy meals if they make nausea worse.", "Speak to a clinician if side effects are strong or persistent."];
    if (medication === "semaglutide") return ["Prioritise protein and fibre.", "Eat slowly and stop when comfortably full.", "Keep hydrated, especially during long shifts.", "Use smaller meals if appetite is reduced.", "Speak to a clinician before changing diet around medication."];
    if (medication === "other") return ["Check medicine guidance or ask a pharmacist/clinician about food restrictions.", "Avoid making major diet changes without professional advice."];
    return [];
  }

  const medicationAdvice = getMedicationAdvice();

  function getAdaptiveMealTimes() {
    if (workDay.shiftType === "night_shift") return [{ name: "Wake-up meal", time: "17:30" }, { name: "Before shift meal", time: "19:00" }, { name: "Night shift snack", time: "23:00" }, { name: "Main shift meal", time: "02:00" }, { name: "Light meal before sleep", time: "07:30" }];
    if (workDay.shiftType === "day_shift") return [{ name: "Breakfast", time: "06:30" }, { name: "Work snack", time: "10:00" }, { name: "Lunch", time: "13:00" }, { name: "Afternoon snack", time: "16:30" }, { name: "Dinner", time: "20:00" }];
    if (workDay.shiftType === "day_off") return [{ name: "Breakfast", time: "08:30" }, { name: "Snack", time: "11:30" }, { name: "Lunch", time: "13:30" }, { name: "Snack", time: "16:30" }, { name: "Dinner", time: "18:30" }];
    return mealTimes;
  }

  const activeMealTimes = getAdaptiveMealTimes();
  const chartWeights = weightLogs.filter((log) => log.weight_kg).sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at)).slice(-10);
  const chartMin = chartWeights.length ? Math.min(...chartWeights.map((log) => Number(log.weight_kg))) : 0;
  const chartMax = chartWeights.length ? Math.max(...chartWeights.map((log) => Number(log.weight_kg))) : 0;
  function getChartPoint(weight) { if (chartMax === chartMin) return 50; return 100 - ((Number(weight) - chartMin) / (chartMax - chartMin)) * 100; }

  if (checkingProfile) return <div style={styles.page}><div style={styles.card}>Loading Future Me Journey...</div></div>;

  if (!session) {
    return (
      <div style={styles.page}>
        <div style={{ maxWidth: 430, margin: "80px auto" }}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "2.8rem", marginBottom: "10px" }}>🌅</div>
              <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.2rem)", color: "#ffffff", margin: 0, lineHeight: 1.1, textAlign: "center" }}>Future Me Journey</h1>
            </div>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>You have already completed the hardest step — making the decision to change.</p>
            <form onSubmit={handleAuth}>
              <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button style={styles.button}>{loading ? "Please wait..." : isSignUp 
              ? "Create account" : "Sign in"}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16, background: "none", border: "none", color: "#93c5fd", cursor: "pointer" }}>{isSignUp ? "Already have an account? Sign in" : "New here? Create account"}</button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div style={styles.page}>
        <div style={{ maxWidth: 520, margin: "60px auto" }}>
          <div style={styles.card}>
            <h1 style={styles.heading}>Create your profile</h1>

            <form onSubmit={handleOnboardingSubmit}>
              <input style={styles.input} placeholder="Full name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
              <input style={styles.input} type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
              <input style={styles.input} type="number" placeholder="Height cm" value={formData.height_cm} onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })} required />
              <input style={styles.input} type="number" step="0.1" placeholder="Current weight kg" value={formData.starting_weight_kg} onChange={(e) => setFormData({ ...formData, starting_weight_kg: e.target.value })} required />
              <input style={styles.input} type="number" step="0.1" placeholder="Goal weight kg" value={formData.target_weight_kg} onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })} required />
              <button style={styles.button}>Save profile</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={{ minHeight: "650px", borderRadius: "24px", padding: "clamp(22px, 6vw, 70px)", marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(90deg, rgba(0,0,0,0.72), rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url('/images/healthy-background.jpg')", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
          <div style={{ maxWidth: "720px", width: "100%", background: "rgba(2,6,23,0.55)", padding: "28px", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🌅</div>
            <h1 style={{ fontSize: "clamp(2.2rem, 7vw, 3.6rem)", color: "#ffffff", margin: 0, lineHeight: 1.1 }}>Future Me Journey</h1>
            <p style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "#f8fafc" }}>You have already completed the hardest step — making the correct choice.<br /><br />From here, let's envision the healthier, stronger and happier version of you waiting in the near future.</p>
            <div style={{ marginTop: "18px", color: "#fde68a", fontWeight: "bold", fontSize: "1rem" }}>Every healthy choice today is an investment in your future self.</div>
            <button style={{ ...styles.button, marginTop: "24px", width: "140px" }} onClick={() => supabase.auth.signOut()}>Sign out</button>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: 20, textAlign: "center", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>🍃 Future Me Journey supports Fatty Liver, Insulin Resistance, Slow Metabolism and Healthy Weight Loss by prioritising:<br /><br />✅ Higher protein meals<br />✅ Lower sugar intake<br />✅ Higher fibre foods<br />✅ Consistent meal timings<br />✅ Gentle daily movement<br />✅ Sustainable healthy habits</div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 18 }}>
          <div style={styles.card}><strong style={styles.heading}>Current Weight</strong><h2 style={styles.heading}>{currentWeight.toFixed(1)} kg</h2></div>
          <div style={styles.card}><strong style={styles.heading}>Goal Weight</strong><h2 style={styles.heading}>{goalWeight.toFixed(1)} kg</h2></div>
          <div style={styles.card}><strong style={styles.heading}>Progress</strong><h2 style={styles.heading}>{progressPercent}%</h2><p style={styles.muted}>{weightLost.toFixed(1)} kg lost</p></div>
          <div style={styles.card}><strong style={styles.heading}>Remaining</strong><h2 style={styles.heading}>{weightRemaining.toFixed(1)} kg</h2></div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginBottom: 18 }}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Work schedule today</h2>
            <select style={styles.input} value={workDay.shiftType} onChange={(e) => setWorkDay({ ...workDay, shiftType: e.target.value })}><option value="day_shift">Day shift</option><option value="night_shift">Night shift</option><option value="day_off">Day off</option><option value="busy_day">Busy day</option></select>
            <select style={styles.input} value={workDay.shiftLength} onChange={(e) => setWorkDay({ ...workDay, shiftLength: e.target.value })}><option value="8">8 hours</option><option value="10">10 hours</option><option value="12">12 hours</option></select>
            <select style={styles.input} value={workDay.jobActivity} onChange={(e) => setWorkDay({ ...workDay, jobActivity: e.target.value })}><option value="sitting">Mainly sitting</option><option value="standing">Mainly standing</option><option value="physical">Physical work</option></select>
            <select style={styles.input} value={workDay.energy} onChange={(e) => setWorkDay({ ...workDay, energy: e.target.value })}><option value="low">Low energy</option><option value="medium">Medium energy</option><option value="good">Good energy</option></select>
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Medication / treatment</h2>
            <select style={styles.input} value={medication} onChange={(e) => setMedication(e.target.value)}><option value="none">No medication</option><option value="mounjaro">Mounjaro / Tirzepatide</option><option value="semaglutide">Semaglutide / Ozempic / Wegovy</option><option value="other">Other medication</option></select>
            {medicationAdvice.length > 0 ? <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>{medicationAdvice.map((item) => <p key={item}>✅ {item}</p>)}</div> : <p style={{ color: "#94a3b8" }}>Select medication if the meal plan needs extra care.</p>}
            <button style={styles.button} onClick={saveUserSettings}>Save Settings</button>
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Today's mission</h2>
            <p style={{ color: "#94a3b8" }}>{missionDone} / {missionItems.length} completed</p>
            {missionItems.map((item) => <p key={item.label}>{item.done ? "✅" : "⬜"} {item.label}</p>)}
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Water tracker</h2>
            <p style={{ color: "#94a3b8" }}>{waterDone} / 8 glasses</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>{[1,2,3,4,5,6,7,8].map((glass) => <button key={glass} onClick={() => toggleWater(glass)} style={{ padding: "14px", borderRadius: "14px", border: "1px solid rgba(148,163,184,0.3)", background: water[glass] ? "rgba(14,165,233,0.8)" : "rgba(15,23,42,0.8)", color: "white", cursor: "pointer" }}>💧 {glass}</button>)}</div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          <div style={styles.card}><h2 style={styles.heading}>Health profile</h2>{healthOptions.map((item) => <label key={item.key} style={{ display: "block", marginBottom: 10 }}><input type="checkbox" checked={!!healthProfile[item.key]} onChange={() => updateHealth(item.key)} /> {item.label}</label>)}</div>
          <div style={styles.card}><h2 style={styles.heading}>Allergens / foods to avoid</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8 }}>{allergenOptions.map((item) => <label key={item}><input type="checkbox" checked={allergens.includes(item)} onChange={() => toggleAllergen(item)} /> {item}</label>)}</div></div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18, marginTop: 18 }}>
          <main style={{ display: "grid", gap: 18 }}>
            <div style={styles.card}>
              <h2 style={styles.heading}>Barcode scanner</h2>
              <input style={styles.input} placeholder="Type barcode manually" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              <button style={styles.button} type="button" onClick={() => findBarcodeFood(barcode)}>Find barcode</button>
              <input style={{ ...styles.input, marginTop: 12 }} type="file" accept="image/*" onChange={(e) => scanBarcodeFromImage(e.target.files?.[0])} />
              <p style={styles.muted}>{barcodeMessage}</p>
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Food search database</h2>
              <input style={styles.input} placeholder="Search chicken, yogurt, rice..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} />
              {searchedFoods.slice(0, 8).map((food) => <div key={food.barcode} style={{ borderBottom: "1px solid rgba(148,163,184,0.15)", padding: "10px 0" }}><strong>{food.food_name}</strong><p style={styles.muted}>{food.calories} kcal • Protein {food.protein_g}g • Carbs {food.carbs_g}g • Fats {food.fats_g}g</p><button style={styles.button} onClick={() => insertMeal({ food_name: food.food_name, meal_type: food.meal_type, calories: food.calories, protein_g: food.protein_g, carbs_g: food.carbs_g, fats_g: food.fats_g })}>Add food</button></div>)}
            </div>


            <div style={styles.card}>
              <h2 style={styles.heading}>AI recipe generator</h2>
              <textarea style={styles.input} placeholder="Example: I have chicken, rice, broccoli" value={recipeIdea} onChange={(e) => setRecipeIdea(e.target.value)} />
              <button style={styles.button} type="button" onClick={generateRecipeIdea}>Generate recipe</button>
              {generatedRecipe && <div style={{ marginTop: 12 }}><h3>{generatedRecipe.name}</h3><p>{generatedRecipe.calories} kcal • Protein {generatedRecipe.protein_g}g • Carbs {generatedRecipe.carbs_g}g • Fats {generatedRecipe.fats_g}g</p><p style={styles.muted}>{generatedRecipe.instructions}</p><button style={styles.button} onClick={addGeneratedRecipe}>Add generated meal</button></div>}
            </div>


            <div style={styles.card}>
              <h2 style={styles.heading}>Suggested meals</h2>
              {suggestedRecipes.map((recipe) => { const calc = calculateRecipe(recipe); return <div key={recipe.name} style={{ borderBottom: "1px solid rgba(148,163,184,0.18)", padding: "12px 0" }}><h3>{recipe.name}</h3><p>{recipe.mealType} • Portion {recipe.portionG}g</p><p>{calc.calories} kcal • Protein {calc.protein}g • Carbs {calc.carbs}g • Fats {calc.fats}g</p><button style={styles.button} onClick={() => logRecipe(recipe)}>Add this meal</button></div>; })}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Add Homemade Meal</h2>

              <form onSubmit={addCustomMeal}>
                <input style={styles.input} placeholder="Meal name" value={customMeal.food_name} onChange={(e) => setCustomMeal({ ...customMeal, food_name: e.target.value })} required />
                <input style={styles.input} placeholder="Calories" type="number" value={customMeal.calories} onChange={(e) => setCustomMeal({ ...customMeal, calories: e.target.value })} required />
                <input style={styles.input} placeholder="Protein g" type="number" value={customMeal.protein_g} onChange={(e) => setCustomMeal({ ...customMeal, protein_g: e.target.value })} />
                <input style={styles.input} placeholder="Carbs g" type="number" value={customMeal.carbs_g} onChange={(e) => setCustomMeal({ ...customMeal, carbs_g: e.target.value })} />
                <input style={styles.input} placeholder="Fats g" type="number" value={customMeal.fats_g} onChange={(e) => setCustomMeal({ ...customMeal, fats_g: e.target.value })} />
                <button style={styles.button}>Add Homemade Meal</button>
              </form>
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Today's Meals</h2>
              {todaysMeals.length === 0 ? <p>No meals logged yet.</p> : todaysMeals.map((meal) => (
                <div key={meal.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.15)", padding: "12px 0" }}>
                  {editingMealId === meal.id ? <div><input style={styles.input} value={editMeal.food_name} onChange={(e) => setEditMeal({ ...editMeal, food_name: e.target.value })} /><input style={styles.input} type="number" value={editMeal.calories} onChange={(e) => setEditMeal({ ...editMeal, calories: e.target.value })} /><input style={styles.input} type="number" placeholder="Protein" value={editMeal.protein_g} onChange={(e) => setEditMeal({ ...editMeal, protein_g: e.target.value })} /><input style={styles.input} type="number" placeholder="Carbs" value={editMeal.carbs_g} onChange={(e) => setEditMeal({ ...editMeal, carbs_g: e.target.value })} /><input style={styles.input} type="number" placeholder="Fats" value={editMeal.fats_g} onChange={(e) => setEditMeal({ ...editMeal, fats_g: e.target.value })} /><button style={styles.button} onClick={() => saveEditedMeal(meal.id)}>Save meal</button><button style={{ ...styles.button, marginTop: 8, background: "#64748b" }} onClick={() => setEditingMealId(null)}>Cancel</button></div> : <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><div><strong>{meal.food_name}</strong><br /><small>{meal.calories} kcal • P {meal.protein_g || 0}g • C {meal.carbs_g || 0}g • F {meal.fats_g || 0}g</small></div><div style={{ display: "flex", gap: 8 }}><button onClick={() => startEditMeal(meal)} style={{ ...styles.smallButton, background: "#0ea5e9" }}>Edit</button><button onClick={() => deleteMeal(meal.id)} style={{ ...styles.smallButton, background: "#ef4444" }}>Delete</button></div></div>}
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Weekly meal planner</h2>
              {weeklyMealPlan.map((day) => <div key={day.day} style={{ borderBottom: "1px solid rgba(148,163,184,0.15)", padding: "10px 0" }}><strong>{day.day}</strong><p>Breakfast: {day.breakfast?.name}</p><p>Lunch: {day.lunch?.name}</p><p>Dinner: {day.dinner?.name}</p></div>)}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Shopping list creator</h2>
              {shoppingList.map((item) => <p key={item.name}>🛒 {item.name}: {Math.round(item.grams)}g</p>)}
            </div>
          </main>

          <aside style={{ display: "grid", gap: 18 }}>
            <div style={styles.card}>
              <h2 style={styles.heading}>Daily nutrition</h2>
              {targets && <><p>Calories: {Math.round(consumedToday.calories)} / {targets.calorieTarget || 0}</p><p>Protein: {Math.round(consumedToday.protein)}g / {targets.proteinG || 0}g</p><p>Carbs: {Math.round(consumedToday.carbs)}g / {targets.carbsG || 0}g</p><p>Fats: {Math.round(consumedToday.fats)}g / {targets.fatsG || 0}g</p></>}
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginTop: "12px" }}>Adjusted for: {[healthProfile.fatty_liver && "Fatty Liver", healthProfile.insulin_resistance && "Insulin Resistance", healthProfile.slow_metabolism && "Slow Metabolism", healthProfile.high_blood_pressure && "High Blood Pressure", healthProfile.high_cholesterol && "High Cholesterol", healthProfile.type_2_diabetes && "Type 2 Diabetes", healthProfile.acid_reflux && "Acid Reflux", healthProfile.kidney_problems && "Kidney Problems", medication === "mounjaro" && "Mounjaro", medication === "semaglutide" && "Semaglutide", workDay?.jobActivity === "sitting" && "Mainly Sitting", workDay?.jobActivity === "standing" && "Mainly Standing", workDay?.jobActivity === "physical" && "Physical Work"].filter(Boolean).join(", ") || "General weight loss"}</p>
            </div>

            <div style={styles.card}><h2 style={styles.heading}>Non-scale victories</h2><p>{victoriesDone} / {nonScaleVictoryOptions.length} checked today</p>{nonScaleVictoryOptions.map((item) => <label key={item} style={{ display: "block", marginBottom: 12 }}><input type="checkbox" checked={!!victories[item]} onChange={() => toggleVictory(item)} /> {item}</label>)}</div>

            <div style={styles.card}><h2 style={styles.heading}>Meal times</h2>{activeMealTimes.map((meal, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 8 }}><input style={styles.input} value={meal.name} onChange={(e) => updateMealTime(index, "name", e.target.value)} /><input style={styles.input} type="time" value={meal.time} onChange={(e) => updateMealTime(index, "time", e.target.value)} /></div>)}</div>

            <div style={styles.card}><h2 style={styles.heading}>🌅 Future Me Journey</h2><p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>{coachMessage}</p><button style={styles.button} onClick={generateCoachMessage}>Inspire Me</button></div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Weight progress</h2>
              {chartWeights.length < 2 ? <p style={{ color: "#94a3b8" }}>Add at least 2 weight entries to see your progress chart.</p> : <><div style={{ position: "relative", height: "180px", borderLeft: "1px solid rgba(148,163,184,0.35)", borderBottom: "1px solid rgba(148,163,184,0.35)", marginTop: "20px", marginBottom: "12px" }}><svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}><polyline fill="none" stroke="#38bdf8" strokeWidth="3" points={chartWeights.map((log, index) => { const x = chartWeights.length === 1 ? 50 : (index / (chartWeights.length - 1)) * 100; const y = getChartPoint(log.weight_kg); return `${x},${y}`; }).join(" ")} />{chartWeights.map((log, index) => { const x = chartWeights.length === 1 ? 50 : (index / (chartWeights.length - 1)) * 100; const y = getChartPoint(log.weight_kg); return <circle key={log.id || index} cx={x} cy={y} r="2.5" fill="#38bdf8" />; })}</svg></div><p style={{ color: "#cbd5e1" }}>Latest: <strong>{currentWeight.toFixed(1)} kg</strong></p><p style={{ color: "#94a3b8" }}>Started: {userProfile.starting_weight_kg} kg</p><p style={{ color: "#22c55e", fontWeight: "bold" }}>Lost: {weightLost.toFixed(1)} kg</p><p style={{ color: "#cbd5e1" }}>Goal: {userProfile.target_weight_kg} kg</p><p style={{ color: "#f59e0b" }}>Remaining: {weightRemaining.toFixed(1)} kg</p><p style={{ color: "#38bdf8", fontWeight: "bold" }}>Progress: {progressPercent.toFixed(1)}%</p><p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Showing your last {chartWeights.length} weight entries.</p></>}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Progress Photos</h2>
              <input style={styles.input} placeholder="Photo note (Week 1, Front View etc)" value={photoNote} onChange={(e) => setPhotoNote(e.target.value)} />
              <input type="file" accept="image/*" style={styles.input} onChange={(e) => { if (e.target.files[0]) setSelectedPhoto(e.target.files[0]); }} />
              <button style={styles.button} type="button" onClick={uploadProgressPhoto}>Upload Photo</button>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "12px", marginTop: "12px" }}>{progressPhotos.length === 0 ? <p style={{ color: "#94a3b8" }}>No progress photos uploaded yet.</p> : progressPhotos.map((photo, index) => <div key={photo.id || index}><img src={photo.photo_url || photo.url} alt={photo.note || "Progress photo"} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "12px" }} /><p style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center" }}>{photo.note || "Progress photo"}</p></div>)}</div>
            </div>

            <div style={styles.card}><h2 style={styles.heading}>Add weight</h2><form onSubmit={handleLogWeightSubmit}><input style={styles.input} type="number" step="0.1" placeholder="Weight kg" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} required /><button style={styles.button}>Add weight</button></form></div>

            <div style={styles.card}><h2 style={styles.heading}>Feedback</h2><form onSubmit={submitFeedback}><input style={styles.input} type="number" min="1" max="5" placeholder="How easy is the app? 1-5" value={feedback.ease} onChange={(e) => setFeedback({ ...feedback, ease: e.target.value })} /><select style={styles.input} value={feedback.wouldUse} onChange={(e) => setFeedback({ ...feedback, wouldUse: e.target.value })}><option value="">Would you use this daily?</option><option value="yes">Yes</option><option value="no">No</option></select><textarea style={styles.input} placeholder="What would you add?" value={feedback.add} onChange={(e) => setFeedback({ ...feedback, add: e.target.value })} /><textarea style={styles.input} placeholder="What confused you?" value={feedback.confusing} onChange={(e) => setFeedback({ ...feedback, confusing: e.target.value })} /><button style={styles.button}>Submit feedback</button></form></div>
          </aside>
        </section>
      </div>
    </div>
  );
}
