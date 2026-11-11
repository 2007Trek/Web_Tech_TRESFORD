import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://qsodrnnxvzryitwtclyt.supabase.co",
  "sb_publishable_LTcpnoQZ7mf5cnb2CgD7qw_hOj-c2ku"
);
const { data: { session } } = await supabase.auth.getSession();
if (!session) location.replace("auth.html");

const nameNode = document.querySelector("#member-name");
const emailNode = document.querySelector("#member-email");
const nameInput = document.querySelector("#display-name");
const feedback = document.querySelector("#profile-feedback");
const metadataName = session?.user?.user_metadata?.full_name || "";
nameNode.textContent = metadataName || session?.user?.email?.split("@")[0] || "member";
nameInput.value = metadataName;
emailNode.textContent = session?.user?.email || "";

document.querySelector("#signout-button").addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.replace("auth.html");
});

document.querySelector("#profile-form").addEventListener("submit", async event => {
  event.preventDefault();
  const displayName = nameInput.value.trim();
  if (displayName.length < 2) { feedback.textContent = "Enter at least two characters."; return; }
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    const { error } = await supabase.auth.updateUser({ data: { full_name: displayName } });
    if (error) throw error;
    nameNode.textContent = displayName;
    feedback.textContent = "Profile updated.";
  } catch (error) { feedback.textContent = error.message || "Could not update profile."; }
  finally { button.disabled = false; }
});

supabase.auth.onAuthStateChange((event, nextSession) => {
  if (!nextSession) location.replace("auth.html");
});