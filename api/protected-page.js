import { createServerClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import fs from "node:fs";
import path from "node:path";

const SUPABASE_URL = "https://qsodrnnxvzryitwtclyt.supabase.co";
const SUPABASE_KEY = "sb_publishable_LTcpnoQZ7mf5cnb2CgD7qw_hOj-c2ku";
const allowed = new Set(["index.html","blog.html","cv.html","member.html"]);

export default async function handler(req,res){
  const file = String(req.query.file || "");
  if(!allowed.has(file)){res.status(404).end("Not found");return;}
  const parsed = parse(req.headers.cookie || "");
  const pending = [];
  const supabase = createServerClient(SUPABASE_URL,SUPABASE_KEY,{
    cookies:{
      getAll(){return Object.entries(parsed).map(([name,value])=>({name,value}));},
      setAll(cookies){for(const item of cookies) pending.push(serialize(item.name,item.value,item.options));}
    }
  });
  const {data,error}=await supabase.auth.getUser();
  if(error || !data.user){
    if(pending.length)res.setHeader("Set-Cookie",pending);
    res.statusCode=302;
    res.setHeader("Location","/auth.html?next="+encodeURIComponent(req.url || "/"));
    res.setHeader("Cache-Control","private, no-store");
    res.end();return;
  }
  if(pending.length)res.setHeader("Set-Cookie",pending);
  try{
    const html=fs.readFileSync(path.join(process.cwd(),file),"utf8");
    res.setHeader("Content-Type","text/html; charset=utf-8");
    res.setHeader("Cache-Control","private, no-store");
    res.status(200).send(html);
  }catch{res.status(404).end("Page not found");}
}
