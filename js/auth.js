import { createBrowserClient } from "https://esm.sh/@supabase/ssr@0.6.1";

const SUPABASE_URL = "https://qsodrnnxvzryitwtclyt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LTcpnoQZ7mf5cnb2CgD7qw_hOj-c2ku";
const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const destination = (() => { const raw = new URLSearchParams(location.search).get("next"); return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/index.html"; })();

const callbackCode = new URLSearchParams(location.search).get("code");
if (callbackCode) {
  const { error } = await supabase.auth.exchangeCodeForSession(callbackCode);
  if (error) {
    const node = document.querySelector("#feedback");
    if (node) node.textContent = "Email verification could not be completed. Please sign in again.";
  } else {
    history.replaceState({}, "", "/auth.html");
    location.replace(destination);
  }
}

const form = document.querySelector("#auth-form");
const title = document.querySelector("#form-title");
const description = document.querySelector("#form-description");
const nameInput = document.querySelector("#full-name");
const nameLabel = document.querySelector("#name-label");
const password = document.querySelector("#password");
const submit = document.querySelector("#submit-button");
const feedback = document.querySelector("#feedback");
const forgot = document.querySelector("#forgot-button");
let mode = "signin";

function setMode(next) {
  mode = next;
  const signup = mode === "signup";
  title.textContent = signup ? "Create your account." : "Welcome back.";
  description.textContent = signup ? "Join the TREK portfolio member community." : "Sign in to access your member space.";
  nameInput.hidden = nameLabel.hidden = !signup;
  nameInput.required = signup;
  password.autocomplete = signup ? "new-password" : "current-password";
  submit.textContent = signup ? "Create account" : "Sign in";
  document.querySelector("#signin-tab").classList.toggle("active", !signup);
  document.querySelector("#signup-tab").classList.toggle("active", signup);
  forgot.hidden = signup;
  feedback.textContent = "";
}
document.querySelector("#signin-tab").addEventListener("click", () => setMode("signin"));
document.querySelector("#signup-tab").addEventListener("click", () => setMode("signup"));

form.addEventListener("submit", async event => {
  event.preventDefault();
  submit.disabled = true;
  feedback.textContent = "Please wait…";
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const pass = password.value;
  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email, password: pass,
        options: { data: { full_name: nameInput.value.trim() }, emailRedirectTo: "https://trek-portfolio.vercel.app/auth.html?next=%2Findex.html" }
      });
      if (error) throw error;
      feedback.textContent = data.session
        ? "Account created. Opening your member area…"
        : "Account created. Check your email to verify your address, then sign in.";
      if (data.session) location.href = destination;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      location.href = destination;
    }
  } catch (error) {
    feedback.textContent = error.message || "Authentication failed. Please try again.";
  } finally {
    submit.disabled = false;
  }
});

forgot.addEventListener("click", async () => {
  const email = document.querySelector("#email").value.trim().toLowerCase();
  if (!email) { feedback.textContent = "Enter your email address first."; return; }
  forgot.disabled = true;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://trek-portfolio.vercel.app/auth.html"
    });
    if (error) throw error;
    feedback.textContent = "If an account exists for that address, a password-reset email has been sent.";
  } catch (error) {
    feedback.textContent = error.message || "Could not request a password reset.";
  } finally { forgot.disabled = false; }
});

const { data: { session } } = await supabase.auth.getSession();
if (session) location.replace(destination);