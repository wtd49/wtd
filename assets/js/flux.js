import { esc, parseGps } from "./app.js";

export async function fetchFlux(url, timeoutMs=8000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if(!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export function formatFluxItem(it){
  const level = String(it.level||"info").toLowerCase();
  const badge = level==="danger"?"🔴":level==="warning"?"🟠":level==="success"?"🟢":"🔵";
  const ts = esc(it.ts||"");
  const title = esc(it.title||"");
  const msg = esc(it.msg||"");
  const ref = esc(it.ref||"");
  const gps = esc(it.gps||"");
  return `<div style="padding:10px;border-bottom:1px solid #eee">
    <div style="font-weight:800">${badge} ${title}</div>
    <div class="muted">${ts}${ref?` · ${ref}`:""}</div>
    <div style="margin-top:6px">${msg}</div>
    ${gps?`<div class="muted" style="margin-top:6px">GPS: ${gps}</div>`:""}
  </div>`;
}

export function itemLatLng(it){
  const ll = parseGps(it.gps);
  return ll ? ll : null;
}
