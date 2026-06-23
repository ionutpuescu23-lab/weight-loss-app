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
    backgroundImage:
      "linear-gradient(rgba(2,6,23,0.70), rgba(2,6,23,0.90)), url('/images/healthy-background.jpg')",
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

heading: {
  color: "#ffffff",
  fontWeight: 800,
},

muted: {
  color: "#cbd5e1",
},
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

function calculateTargets(profile, workDay, medication, healthProfile) {
  if (!profile) return null;

  const weight = Number(profile.current_weight_kg);
  const height = Number(profile.height_cm);
  const age = Number(profile.age || 30);

  const bmr = Math.round(
    10 * weight +
    6.25 * height -
    5 * age +
    5
  );

  let activityMultiplier = 1.2;

  if (workDay?.jobActivity === "standing") {
    activityMultiplier = 1.35;
  }

  if (workDay?.jobActivity === "physical") {
    activityMultiplier = 1.55;
  }

  const tdee = Math.round(bmr * activityMultiplier);

  let calorieTarget = Math.max(1200, tdee - 500);

  if (medication === "mounjaro") {
    calorieTarget -= 200;
  }

  if (medication === "semaglutide") {
    calorieTarget -= 150;
  }

  let proteinPercent = 0.30;
  let carbPercent = 0.40;
  let fatPercent = 0.30;

  if (
    healthProfile?.insulin_resistance ||
    healthProfile?.fatty_liver
  ) {
    proteinPercent = 0.35;
    carbPercent = 0.30;
    fatPercent = 0.35;
  }

  return {
    bmr,
    tdee,
    calorieTarget,
    proteinG: Math.round((calorieTarget * proteinPercent) / 4),
    carbsG: Math.round((calorieTarget * carbPercent) / 4),
    fatsG: Math.round((calorieTarget * fatPercent) / 9),
  };
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

  const [workDay, setWorkDay] = useState({
    shiftType: "day_shift",
    shiftLength: "12",
    jobActivity: "sitting",
    energy: "low",
  });

  const [medication, setMedication] = useState("none");
const [progressPhotos, setProgressPhotos] = useState([]);
const [photoNote, setPhotoNote] = useState("");
const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [feedback, setFeedback] = useState({
    ease: "",
    wouldUse: "",
    add: "",
    confusing: "",
  });

  const [coachMessage, setCoachMessage] = useState(
    "You have already completed the hardest step — making the decision to change. Every healthy meal, every walk, and every positive choice brings you closer to your future self."
  );

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
    await Promise.all([
  fetchUserProfile(userId),
  fetchWeightLogs(userId),
  fetchMealLogs(userId),
  fetchWaterLogs(userId),
  fetchProgressPhotos(userId),
]);
    setCheckingProfile(false);
  }

  async function fetchUserProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (data) {
      setHealthProfile(data.health_profile || {});
setAllergens(data.allergens || []);
setWorkDay(data.work_day || {
  shiftType: "day_shift",
  shiftLength: "12",
  jobActivity: "sitting",
  energy: "low",
});
setMedication(data.medication || "none");
setMealTimes(data.meal_times || defaultMealTimes);
      setUserProfile(data);
      setHasProfile(true);
    } else setHasProfile(false);
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

  const { data, error } = await supabase
    .from("water_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("logged_date", today);

  if (error) {
    alert(error.message);
    return;
  }

  const savedWater = {};
  (data || []).forEach((log) => {
    savedWater[log.glass_number] = log.completed;
  });

  setWater(savedWater);
}

async function fetchProgressPhotos(userId) {
  const { data, error } = await supabase
    .from("progress_photos")
    .select("*")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  setProgressPhotos(data || []);
}


  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);

    const response = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

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
    allergens: allergens,
    work_day: workDay,
    medication: medication,
    meal_times: mealTimes,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .insert([payload]);

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  await supabase.from("weight_logs").insert([
    {
      user_id: session.user.id,
      weight_kg: Number(formData.starting_weight_kg),
    },
  ]);

  await initApp(session.user.id);
  setLoading(false);
}
async function saveUserSettings() {
  const { error } = await supabase
    .from("profiles")
    .update({
  health_profile: healthProfile,
  allergens: allergens,
  work_day: workDay,
  medication: medication,
  meal_times: mealTimes,
  updated_at: new Date().toISOString(),
})
    .eq("id", session.user.id);

  if (error) {
    alert(error.message);
  } else {
    alert("Settings saved");
  }
}

  async function logRecipe(recipe) {
    const calc = calculateRecipe(recipe);

    const { error } = await supabase.from("meal_logs").insert([
  {
    user_id: session.user.id,
    food_name: recipe.name,
    meal_type: recipe.mealType,
    calories: calc.calories,
    protein_g: calc.protein,
    carbs_g: calc.carbs,
    fats_g: calc.fats,
  },
]);

    if (error) alert(error.message);
    else fetchMealLogs(session.user.id);
  }

  async function handleLogWeightSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("weight_logs").insert([
      { user_id: session.user.id, weight_kg: Number(newWeight) },
    ]);

    if (error) alert(error.message);
    else {
      setNewWeight("");
      fetchWeightLogs(session.user.id);
    }
  }

  function toggleAllergen(item) {
    setAllergens((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);
  }

  function updateHealth(key) {
    setHealthProfile((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function updateMealTime(index, field, value) {
    const copy = [...mealTimes];
    copy[index][field] = value;
    setMealTimes(copy);
  }

  function toggleExercise(name) {
    setCompletedExercises((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function toggleVictory(name) {
    setVictories((prev) => ({ ...prev, [name]: !prev[name] }));
  }
async function toggleWater(index) {
  const today = new Date().toISOString().split("T")[0];
  const currentlyDone = !!water[index];

  setWater((prev) => ({
    ...prev,
    [index]: !currentlyDone,
  }));

  if (currentlyDone) {
    await supabase
      .from("water_logs")
      .delete()
      .eq("user_id", session.user.id)
      .eq("glass_number", index)
      .eq("logged_date", today);
  } else {
    await supabase
      .from("water_logs")
      .insert([
        {
          user_id: session.user.id,
          glass_number: index,
          logged_date: today,
          completed: true,
        },
      ]);
  }
}


async function uploadProgressPhoto() {
  if (!selectedPhoto) {
    alert("Please choose a photo first");
    return;
  }

  if (!session?.user?.id) {
    alert("You must be signed in to upload photos");
    return;
  }

  const cleanName = selectedPhoto.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `${session.user.id}/${Date.now()}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from("progress-photos")
    .upload(filePath, selectedPhoto);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("progress-photos")
    .getPublicUrl(filePath);

  const newPhoto = {
    user_id: session.user.id,
    photo_url: data.publicUrl,
    note: photoNote || "Progress photo",
  };

  const { error: insertError } = await supabase
    .from("progress_photos")
    .insert([newPhoto]);

  if (insertError) {
    alert(insertError.message);
    return;
  }

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

  const targets = useMemo(
  () =>
    calculateTargets(
      userProfile,
      workDay,
      medication,
      healthProfile
    ),
  [userProfile, workDay, medication, healthProfile]
);
  const todaysMeals = useMemo(() => todayOnly(mealLogs), [mealLogs]);

  const consumedToday = useMemo(() => {
    return todaysMeals.reduce(
      (acc, log) => {
        acc.calories += Number(log.calories) || 0;
        acc.protein += Number(log.protein_g) || 0;
        acc.carbs += Number(log.carbs_g) || 0;
        acc.fats += Number(log.fats_g) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [todaysMeals]);

  const suggestedRecipes = useMemo(() => {
    const activeHealth = Object.keys(healthProfile).filter((key) => healthProfile[key]);

    return recipeDatabase.filter((recipe) => {
      const blockedByAllergy = recipe.allergens.some((a) => allergens.includes(a));
      if (blockedByAllergy) return false;
      if (activeHealth.length === 0) return true;
      return activeHealth.some((condition) => recipe.tags.includes(condition));
    });
  }, [healthProfile, allergens]);

  const currentWeight = weightLogs.length
    ? Number(weightLogs[weightLogs.length - 1].weight_kg)
    : Number(userProfile?.starting_weight_kg || 0);

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

    if (workDay.shiftType === "day_off") {
      return [
        { label: "Drink 8 glasses of water", done: waterDone >= 8 },
        { label: "Complete daily exercise", done: exerciseDone >= defaultExercises.length },
        { label: "Log at least one meal", done: todaysMeals.length > 0 },
        { label: "Check one non-scale victory", done: victoriesDone >= 1 },
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
    if (medication === "mounjaro") {
      return [
        "Protein first, because appetite may be lower.",
        "Use smaller meals instead of large plates.",
        "Drink water regularly through the day.",
        "Avoid very greasy meals if they make nausea worse.",
        "Speak to a clinician if side effects are strong or persistent.",
      ];
    }

    if (medication === "semaglutide") {
      return [
        "Prioritise protein and fibre.",
        "Eat slowly and stop when comfortably full.",
        "Keep hydrated, especially during long shifts.",
        "Use smaller meals if appetite is reduced.",
        "Speak to a clinician before changing diet around medication.",
      ];
    }
    if (medication === "other") {
      return [
        "Check medicine guidance or ask a pharmacist/clinician about food restrictions.",
        "Avoid making major diet changes without professional advice.",
      ];
    }

    return [];
  }

  const medicationAdvice = getMedicationAdvice();

  function getAdaptiveMealTimes() {
  if (workDay.shiftType === "night_shift") {
    return [
      { name: "Wake-up meal", time: "17:30" },
      { name: "Before shift meal", time: "19:00" },
      { name: "Night shift snack", time: "23:00" },
      { name: "Main shift meal", time: "02:00" },
      { name: "Light meal before sleep", time: "07:30" },
    ];
  }

  if (workDay.shiftType === "day_shift") {
    return [
      { name: "Breakfast", time: "06:30" },
      { name: "Work snack", time: "10:00" },
      { name: "Lunch", time: "13:00" },
      { name: "Afternoon snack", time: "16:30" },
      { name: "Dinner", time: "20:00" },
    ];
  }

  if (workDay.shiftType === "day_off") {
    return [
      { name: "Breakfast", time: "08:30" },
      { name: "Snack", time: "11:30" },
      { name: "Lunch", time: "13:30" },
      { name: "Snack", time: "16:30" },
      { name: "Dinner", time: "18:30" },
    ];
  }

  return mealTimes;
}
const chartWeights = weightLogs
  .filter((log) => log.weight_kg)
  .sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at))
  .slice(-10);

const chartMin = chartWeights.length
  ? Math.min(...chartWeights.map((log) => Number(log.weight_kg)))
  : 0;

const chartMax = chartWeights.length
  ? Math.max(...chartWeights.map((log) => Number(log.weight_kg)))
  : 0;

function getChartPoint(weight) {
  if (chartMax === chartMin) return 50;
  return 100 - ((Number(weight) - chartMin) / (chartMax - chartMin)) * 100;
}
const activeMealTimes = getAdaptiveMealTimes();
  if (checkingProfile) {
    return <div style={styles.page}><div style={styles.card}>Loading Future Me Journey...</div></div>;
  }

  if (!session) {
    return (
      <div style={styles.page}>
        <div style={{ maxWidth: 430, margin: "80px auto" }}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "2.8rem", marginBottom: "10px" }}>🌅</div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 8vw, 3.2rem)",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.1,
                  textAlign: "center",
                }}
              >
                Future Me Journey
              </h1>
            </div>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              You have already completed the hardest step — making the decision to change.
            </p>

            <form onSubmit={handleAuth}>
              <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button style={styles.button}>{loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}</button>
              
            </form>

            <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16, background: "none", border: "none", color: "#93c5fd", cursor: "pointer" }}>
              {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
            </button>
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
        <div
          style={{
            minHeight: "650px",
            borderRadius: "24px",
            padding: "clamp(22px, 6vw, 70px)",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.72), rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url('/images/healthy-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "650px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              maxWidth: "720px",
              width: "100%",
              background: "rgba(2,6,23,0.55)",
              padding: "28px",
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🌅</div>
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 3.6rem)",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.1,
                  textAlign: "center",
                }}
              >
                Future Me Journey
              </h1>
            </div>

            <p style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "#f8fafc", margin: 0 }}>
              You have already completed the hardest step — making the correct choice.
              <br /><br />
              From here, let's envision the healthier, stronger and happier version of you waiting in the near future.
            </p>

            <div style={{ marginTop: "18px", color: "#fde68a", fontWeight: "bold", fontSize: "1rem" }}>
              Every healthy choice today is an investment in your future self.
            </div>

            <button
              style={{ marginTop: "24px", width: "140px", padding: "11px 16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "white", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: 20, textAlign: "center", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
          🍃 Future Me Journey supports Fatty Liver, Insulin Resistance, Slow Metabolism and Healthy Weight Loss by prioritising:
          <br /><br />
          ✅ Higher protein meals<br />
          ✅ Lower sugar intake<br />
          ✅ Higher fibre foods<br />
          ✅ Consistent meal timings<br />
          ✅ Gentle daily movement<br />
          ✅ Sustainable healthy habits
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 18 }}>
          <div style={styles.card}><strong style={styles.heading}>Current Weight</strong><h2 style={styles.heading}>{currentWeight.toFixed(1)} kg</h2></div>
          <div style={styles.card}><strong style={styles.heading}>Goal Weight</strong><h2 style={styles.heading}>{goalWeight.toFixed(1)} kg</h2></div>
          <div style={styles.card}><strong style={styles.heading}>Progress</strong><h2 style={styles.heading}>{progressPercent}%</h2><p style={styles.muted}>{weightLost.toFixed(1)} kg lost</p></div>
          <div style={styles.card}><strong style={styles.heading}>Remaining</strong><h2 style={styles.heading}>{weightRemaining.toFixed(1)} kg</h2></div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginBottom: 18 }}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Work schedule today</h2>

            <select
              style={styles.input}
              value={workDay.shiftType}
              onChange={(e) => setWorkDay({ ...workDay, shiftType: e.target.value })}
            >
              <option value="day_shift">Day shift</option>
              <option value="night_shift">Night shift</option>
              <option value="day_off">Day off</option>
              <option value="busy_day">Busy day</option>
            </select>

            <select
              style={styles.input}
              value={workDay.shiftLength}
              onChange={(e) => setWorkDay({ ...workDay, shiftLength: e.target.value })}
            >
              <option value="8">8 hours</option>
              <option value="10">10 hours</option>
              <option value="12">12 hours</option>
            </select>

            <select
              style={styles.input}
              value={workDay.jobActivity}
              onChange={(e) => setWorkDay({ ...workDay, jobActivity: e.target.value })}
            >
              <option value="sitting">Mainly sitting</option>
              <option value="standing">Mainly standing</option>
              <option value="physical">Physical work</option>
            </select>

            <select
              style={styles.input}
              value={workDay.energy}
              onChange={(e) => setWorkDay({ ...workDay, energy: e.target.value })}
            >
              <option value="low">Low energy</option>
              <option value="medium">Medium energy</option>
              <option value="good">Good energy</option>
            </select>
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Medication / treatment</h2>
            <select
              style={styles.input}
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
            >
              <option value="none">No medication</option>
              <option value="mounjaro">Mounjaro / Tirzepatide</option>
              <option value="semaglutide">Semaglutide / Ozempic / Wegovy</option>
              <option value="other">Other medication</option>
            </select>

            {medicationAdvice.length > 0 ? (
              <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                {medicationAdvice.map((item) => (
                  <p key={item}>✅ {item}</p>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>
                Select medication if the meal plan needs extra care.
              </p>
            )}

            <button
              style={styles.button}
              onClick={saveUserSettings}
            >
              Save Settings
            </button>
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Today's mission</h2>
            <p style={{ color: "#94a3b8" }}>{missionDone} / {missionItems.length} completed</p>
            {missionItems.map((item) => (
              <p key={item.label}>{item.done ? "✅" : "⬜"} {item.label}</p>
            ))}
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Water tracker</h2>
            <p style={{ color: "#94a3b8" }}>{waterDone} / 8 glasses</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <button
                  key={glass}
                  onClick={() => toggleWater(glass)}
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(148,163,184,0.3)",
                    background: water[glass] ? "rgba(14,165,233,0.8)" : "rgba(15,23,42,0.8)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  💧 {glass}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Health profile</h2>
            {healthOptions.map((item) => (
              <label key={item.key} style={{ display: "block", marginBottom: 10 }}>
                <input type="checkbox" checked={!!healthProfile[item.key]} onChange={() => updateHealth(item.key)} /> {item.label}
              </label>
            ))}
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Allergens / foods to avoid</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8 }}>
              {allergenOptions.map((item) => (
                <label key={item}>
                  <input type="checkbox" checked={allergens.includes(item)} onChange={() => toggleAllergen(item)} /> {item}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18, marginTop: 18 }}>
          <main style={{ display: "grid", gap: 18 }}>
            <div style={styles.card}>
              <h2 style={styles.heading}>Suggested meals</h2>
              {suggestedRecipes.map((recipe) => {
                const calc = calculateRecipe(recipe);
                return (
                  <div key={recipe.name} style={{ borderBottom: "1px solid rgba(148,163,184,0.18)", padding: "16px 0" }}>
                    <img src={recipe.image} alt={recipe.name} onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 16, marginBottom: 12 }} />
                    <h3 style={styles.heading}>{recipe.name}</h3>
                    <p>{recipe.mealType} · Portion {recipe.portionG}g</p>
                    <p><strong>{calc.calories} kcal</strong> · Protein {calc.protein}g · Carbs {calc.carbs}g · Fats {calc.fats}g</p>
                    <p style={{ color: "#94a3b8" }}>Allergens: {recipe.allergens.length ? recipe.allergens.join(", ") : "None listed"}</p>
                    <button style={styles.button} onClick={() => logRecipe(recipe)}>Add this meal</button>
                  </div>
                );
              })}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Today's meals</h2>
              {todaysMeals.length === 0 ? <p>No meals logged yet.</p> : todaysMeals.map((meal) => (
                <div key={meal.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(148,163,184,0.15)", padding: "12px 0" }}>
                  <span>{meal.meal_name || meal.food_name || "Meal"}</span>
                  <strong>{meal.calories} kcal</strong>
                </div>
              ))}
            </div>
          </main>

          <aside style={{ display: "grid", gap: 18 }}>
            <div style={styles.card}>
  <h2 style={styles.heading}>Daily nutrition</h2>

  {targets && (
    <>
      <p>Calories: {Math.round(consumedToday.calories)} / {targets.calorieTarget}</p>
      <p>Protein: {Math.round(consumedToday.protein)}g / {targets.proteinG}g</p>
      <p>Carbs: {Math.round(consumedToday.carbs)}g / {targets.carbsG}g</p>
      <p>Fats: {Math.round(consumedToday.fats)}g / {targets.fatsG}g</p>
    </>
  )}

 <p
  style={{
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginTop: "12px",
  }}
>
  Adjusted for:
  {healthProfile.fatty_liver && " Fatty Liver,"}
  {healthProfile.insulin_resistance && " Insulin Resistance,"}
  {medication === "mounjaro" && " Mounjaro,"}
  {medication === "semaglutide" && " Semaglutide,"}
  {workDay?.jobActivity === "sitting" && " Mainly Sitting,"}
  {workDay?.jobActivity === "standing" && " Mainly Standing,"}
  {workDay?.jobActivity === "physical" && " Physical Work"}
</p>

</div>
            <div style={styles.card}>
              <h2 style={styles.heading}>Non-scale victories</h2>
              <p>{victoriesDone} / {nonScaleVictoryOptions.length} checked today</p>
              {nonScaleVictoryOptions.map((item) => (
                <label key={item} style={{ display: "block", marginBottom: 12 }}>
                  <input type="checkbox" checked={!!victories[item]} onChange={() => toggleVictory(item)} /> {item}
                </label>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Meal times</h2>
              {activeMealTimes.map((meal, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 8 }}>
                  <input style={styles.input} value={meal.name} onChange={(e) => updateMealTime(index, "name", e.target.value)} />
                  <input style={styles.input} type="time" value={meal.time} onChange={(e) => updateMealTime(index, "time", e.target.value)} />
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>🌅 Future Me Journey</h2>
              <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>{coachMessage}</p>
              <button style={styles.button} onClick={generateCoachMessage}>Inspire Me</button>
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Weight progress</h2>

              {chartWeights.length < 2 ? (
                <p style={{ color: "#94a3b8" }}>
                  Add at least 2 weight entries to see your progress chart.
                </p>
              ) : (
                <>
                  <div
                    style={{
                      position: "relative",
                      height: "180px",
                      borderLeft: "1px solid rgba(148,163,184,0.35)",
                      borderBottom: "1px solid rgba(148,163,184,0.35)",
                      marginTop: "20px",
                      marginBottom: "12px",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        overflow: "visible",
                      }}
                    >
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        points={chartWeights
                          .map((log, index) => {
                            const x =
                              chartWeights.length === 1
                                ? 50
                                : (index / (chartWeights.length - 1)) * 100;
                            const y = getChartPoint(log.weight_kg);
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />

                      {chartWeights.map((log, index) => {
                        const x =
                          chartWeights.length === 1
                            ? 50
                            : (index / (chartWeights.length - 1)) * 100;
                        const y = getChartPoint(log.weight_kg);

                        return (
                          <circle
                            key={log.id || index}
                            cx={x}
                            cy={y}
                            r="2.5"
                            fill="#38bdf8"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <p style={{ color: "#cbd5e1" }}>
                    Latest: <strong>{currentWeight.toFixed(1)} kg</strong>
                  </p>

                  {userProfile && (
                    <>
                      <p style={{ color: "#94a3b8" }}>
                        Started: {userProfile.starting_weight_kg} kg
                      </p>

                      <p style={{ color: "#22c55e", fontWeight: "bold" }}>
                        Lost: {weightLost.toFixed(1)} kg
                      </p>

                      <p style={{ color: "#cbd5e1" }}>
                        Goal: {userProfile.target_weight_kg} kg
                      </p>

                      <p style={{ color: "#f59e0b" }}>
                        Remaining: {weightRemaining.toFixed(1)} kg
                      </p>

                      <p style={{ color: "#38bdf8", fontWeight: "bold" }}>
                        Progress: {progressPercent.toFixed(1)}%
                      </p>
                    </>
                  )}

                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    Showing your last {chartWeights.length} weight entries.
                  </p>
                </>
              )}
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Progress Photos</h2>

              <input
                style={styles.input}
                placeholder="Photo note (Week 1, Front View etc)"
                value={photoNote}
                onChange={(e) => setPhotoNote(e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                style={styles.input}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setSelectedPhoto(e.target.files[0]);
                  }
                }}
              />

              <button
                style={styles.button}
                type="button"
                onClick={uploadProgressPhoto}
              >
                Upload Photo
              </button>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                {progressPhotos.length === 0 ? (
                  <p style={{ color: "#94a3b8" }}>
                    No progress photos uploaded yet.
                  </p>
                ) : (
                  progressPhotos.map((photo, index) => (
                    <div key={photo.id || index}>
                      <img
                        src={photo.photo_url || photo.url}
                        alt={photo.note || "Progress photo"}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#94a3b8",
                          textAlign: "center",
                        }}
                      >
                        {photo.note || "Progress photo"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Add weight</h2>
              <form onSubmit={handleLogWeightSubmit}>
                <input
                  style={styles.input}
                  type="number"
                  step="0.1"
                  placeholder="Weight kg"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                />
                <button style={styles.button}>Add weight</button>
              </form>
            </div>

            <div style={styles.card}>
              <h2 style={styles.heading}>Feedback</h2>
              <form onSubmit={submitFeedback}>
                <input style={styles.input} type="number" min="1" max="5" placeholder="How easy is the app? 1-5" value={feedback.ease} onChange={(e) => setFeedback({ ...feedback, ease: e.target.value })} />
                <select style={styles.input} value={feedback.wouldUse} onChange={(e) => setFeedback({ ...feedback, wouldUse: e.target.value })}>
                  <option value="">Would you use this daily?</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <textarea style={styles.input} placeholder="What would you add?" value={feedback.add} onChange={(e) => setFeedback({ ...feedback, add: e.target.value })} />
                <textarea style={styles.input} placeholder="What confused you?" value={feedback.confusing} onChange={(e) => setFeedback({ ...feedback, confusing: e.target.value })} />
                <button style={styles.button}>Submit feedback</button>
              </form>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}