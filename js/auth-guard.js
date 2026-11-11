import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const supabase=createClient("https://qsodrnnxvzryitwtclyt.supabase.co","sb_publishable_LTcpnoQZ7mf5cnb2CgD7qw_hOj-c2ku");
const {data:{session}}=await supabase.auth.getSession();
if(!session){const next=encodeURIComponent(location.pathname+location.search+location.hash);location.replace("/auth.html?next="+next);}
supabase.auth.onAuthStateChange((event,nextSession)=>{if(!nextSession)location.replace("/auth.html");});
