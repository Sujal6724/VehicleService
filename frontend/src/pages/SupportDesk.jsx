import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/v1";
const FONTS_ID = "sd-fonts";
const STYLE_ID = "sd-styles";

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.sd-root{min-height:100vh;background:#f0f0ec;font-family:'DM Sans',sans-serif;color:#1a1a1a;display:flex;flex-direction:column;}
.sd-nav{height:64px;background:#fff;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;padding:0 28px;gap:18px;position:sticky;top:0;z-index:100;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
.sd-brand{display:flex;align-items:center;gap:10px;}
.sd-brand-icon{width:36px;height:36px;background:linear-gradient(135deg,#e05c2a,#c44e1e);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(224,92,42,0.35);}
.sd-brand-name{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#111;letter-spacing:-0.3px;}
.sd-search-box{display:flex;align-items:center;gap:8px;background:#f5f5f2;border:1.5px solid #e8e8e8;border-radius:10px;padding:8px 14px;width:320px;transition:border-color 0.18s,box-shadow 0.18s;}
.sd-search-box:focus-within{border-color:#e05c2a;box-shadow:0 0 0 3px rgba(224,92,42,0.1);background:#fff;}
.sd-search-box input{border:none;background:none;outline:none;font-size:14px;color:#374151;font-family:'DM Sans',sans-serif;width:100%;}
.sd-search-box input::placeholder{color:#aaa;}
.sd-nav-gap{flex:1;}
.sd-nav-icon{width:36px;height:36px;border-radius:9px;border:1.5px solid #e8e8e8;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#777;transition:all 0.18s;position:relative;}
.sd-nav-icon:hover{border-color:#e05c2a;color:#e05c2a;background:#fef3ee;}
.sd-notif-dot{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:#e05c2a;border-radius:50%;border:2px solid #fff;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;}
.sd-agent{display:flex;align-items:center;gap:10px;margin-left:4px;}
.sd-agent-info{text-align:right;}
.sd-agent-name{font-size:13.5px;font-weight:700;color:#111;line-height:1.2;}
.sd-agent-role{font-size:12px;color:#aaa;}
.sd-agent-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#e05c2a,#c44e1e);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;border:2px solid rgba(224,92,42,0.2);}
.sd-page{max-width:1100px;width:100%;margin:0 auto;padding:26px 24px 52px;}
.sd-tabs{display:flex;align-items:center;border-bottom:2px solid #e8e8e8;margin-bottom:22px;gap:0;}
.sd-tab{display:flex;align-items:center;gap:7px;padding:11px 20px;font-size:14px;font-weight:500;color:#888;border:none;background:none;font-family:'DM Sans',sans-serif;cursor:pointer;position:relative;top:2px;border-bottom:2.5px solid transparent;transition:color 0.18s;white-space:nowrap;}
.sd-tab:hover{color:#333;}
.sd-tab.on{color:#e05c2a;font-weight:700;border-bottom-color:#e05c2a;}
.sd-tab-pill{padding:2px 8px;border-radius:12px;font-size:11.5px;font-weight:700;background:#fef3ee;color:#e05c2a;margin-left:2px;}
.sd-tab.on .sd-tab-pill{background:#e05c2a;color:#fff;}
.sd-filters{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap;}
.sd-filt-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1.5px solid #ddd;border-radius:8px;font-size:13.5px;font-weight:500;color:#333;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
.sd-filt-btn:hover{border-color:#e05c2a;background:#fef3ee;color:#e05c2a;}
.sd-more{display:flex;align-items:center;gap:6px;padding:8px 12px;background:none;border:none;font-size:13.5px;font-weight:500;color:#888;cursor:pointer;font-family:'DM Sans',sans-serif;transition:color 0.18s;}
.sd-more:hover{color:#e05c2a;}
.sd-gap{flex:1;}
.sd-create{display:flex;align-items:center;gap:7px;padding:10px 20px;background:#e05c2a;border:none;border-radius:9px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 14px rgba(224,92,42,0.35);transition:background 0.18s,transform 0.1s;}
.sd-create:hover{background:#c44e1e;}
.sd-create:active{transform:scale(0.97);}
.sd-card{background:#fff;border:1px solid #e8e8e8;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);margin-bottom:18px;}
.sd-tbl{width:100%;border-collapse:collapse;}
.sd-tbl thead tr{background:#fafafa;border-bottom:1.5px solid #f0f0ec;}
.sd-tbl th{padding:12px 18px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.7px;text-align:left;}
.sd-tbl td{padding:16px 18px;font-size:13.5px;color:#374151;border-bottom:1px solid #f9f9f7;vertical-align:middle;}
.sd-tbl tbody tr:last-child td{border-bottom:none;}
.sd-tbl tbody tr{cursor:pointer;transition:background 0.14s;}
.sd-tbl tbody tr:hover td{background:#fef9f7;}
.sd-tid{font-size:13px;font-weight:700;color:#bbb;}
.sd-ttitle{font-size:14px;font-weight:700;color:#111;margin-bottom:4px;}
.sd-tmeta{font-size:12px;color:#bbb;}
.sd-req{display:flex;align-items:center;gap:10px;}
.sd-req-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
.sd-req-name{font-size:13.5px;font-weight:600;color:#111;margin-bottom:2px;}
.sd-req-type{font-size:12px;color:#bbb;}
.sd-st{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;}
.sd-st-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0;}
.sd-st.in_progress{background:rgba(234,179,8,0.12);color:#a16207;border:1px solid rgba(234,179,8,0.25);}
.sd-st.new{background:rgba(59,130,246,0.1);color:#1d4ed8;border:1px solid rgba(59,130,246,0.2);}
.sd-st.awaiting_reply{background:rgba(249,115,22,0.1);color:#c2410c;border:1px solid rgba(249,115,22,0.22);}
.sd-st.resolved{background:rgba(34,197,94,0.1);color:#15803d;border:1px solid rgba(34,197,94,0.2);}
.sd-st.open{background:rgba(59,130,246,0.1);color:#1d4ed8;border:1px solid rgba(59,130,246,0.2);}
.sd-st.escalated{background:rgba(239,68,68,0.1);color:#dc2626;border:1px solid rgba(239,68,68,0.2);}
.sd-st.closed{background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb;}
.sd-pr{display:inline-flex;align-items:center;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:700;}
.sd-pr.critical{background:rgba(239,68,68,0.1);color:#dc2626;}
.sd-pr.urgent{background:rgba(239,68,68,0.1);color:#dc2626;}
.sd-pr.high{background:rgba(249,115,22,0.1);color:#ea580c;}
.sd-pr.medium{background:rgba(234,179,8,0.1);color:#a16207;}
.sd-pr.low{background:rgba(34,197,94,0.1);color:#15803d;}
.sd-act{font-size:12.5px;color:#bbb;}
.sd-tfoot{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-top:1px solid #f0f0ec;}
.sd-tfoot-info{font-size:13px;color:#bbb;}
.sd-pages{display:flex;align-items:center;gap:6px;}
.sd-pg{width:32px;height:32px;border-radius:8px;border:1.5px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13.5px;font-weight:500;color:#374151;transition:all 0.15s;}
.sd-pg:hover{border-color:#e05c2a;color:#e05c2a;background:#fef3ee;}
.sd-pg.on{background:#e05c2a;border-color:#e05c2a;color:#fff;font-weight:700;}
.sd-pg:disabled{opacity:0.35;cursor:not-allowed;}
.sd-bottom{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.sd-prio-card{background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
.sd-card-lbl{font-size:10.5px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:14px;}
.sd-prow{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.sd-prow:last-child{margin-bottom:0;}
.sd-pname{font-size:14px;font-weight:500;color:#1a1a1a;margin-bottom:5px;}
.sd-ptrack{height:5px;background:#f0f0ec;border-radius:3px;overflow:hidden;}
.sd-pbar{height:100%;border-radius:3px;transition:width 0.6s ease;}
.sd-pnum{font-size:14px;font-weight:700;color:#1a1a1a;margin-left:14px;min-width:24px;text-align:right;}
.sd-resp-card{background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
.sd-bars{display:flex;align-items:flex-end;gap:7px;height:80px;margin-bottom:14px;}
.sd-bc{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;}
.sd-b{width:100%;border-radius:4px 4px 0 0;background:#fcd9c8;transition:background 0.18s;}
.sd-b:hover,.sd-b.hl{background:#e05c2a;}
.sd-bday{font-size:10px;color:#bbb;}
.sd-resp-stat{text-align:center;}
.sd-resp-val{font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#1a1a1a;letter-spacing:-0.5px;}
.sd-resp-sub{font-size:12.5px;color:#bbb;margin-top:3px;}
.sd-goal-card{background:linear-gradient(135deg,#e05c2a 0%,#c44e1e 100%);border-radius:14px;padding:20px;color:#fff;box-shadow:0 4px 16px rgba(224,92,42,0.3);position:relative;overflow:hidden;}
.sd-goal-card::after{content:"";position:absolute;bottom:-24px;right:-24px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,0.08);}
.sd-goal-lbl{font-size:10.5px;font-weight:700;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:10px;}
.sd-goal-pct{font-family:'Sora',sans-serif;font-size:44px;font-weight:800;color:#fff;line-height:1;letter-spacing:-2px;margin-bottom:8px;}
.sd-goal-desc{font-size:13px;color:rgba(255,255,255,0.8);line-height:1.5;margin-bottom:18px;}
.sd-goal-btn{display:inline-flex;align-items:center;padding:8px 16px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);border-radius:8px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.18s;position:relative;z-index:1;}
.sd-goal-btn:hover{background:rgba(255,255,255,0.25);}
.sd-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.42);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;backdrop-filter:blur(3px);animation:sdFd 0.2s ease;}
@keyframes sdFd{from{opacity:0;}to{opacity:1;}}
.sd-modal{background:#fff;border-radius:16px;width:100%;max-width:520px;box-shadow:0 24px 64px rgba(0,0,0,0.18);animation:sdUp 0.26s cubic-bezier(0.22,1,0.36,1);}
@keyframes sdUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.sd-mh{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid #f0f0ec;}
.sd-mt{font-family:'Sora',sans-serif;font-size:17px;font-weight:700;color:#111;}
.sd-mx{width:30px;height:30px;border-radius:8px;border:1.5px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#bbb;transition:all 0.18s;}
.sd-mx:hover{background:#fee2e2;color:#dc2626;border-color:#fca5a5;}
.sd-mb{padding:18px 22px;}
.sd-mft{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.sd-mft:last-child{margin-bottom:0;}
.sd-ml{font-size:12.5px;font-weight:600;color:#374151;}
.sd-mi{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;color:#111;outline:none;transition:border-color 0.18s,box-shadow 0.18s;}
.sd-mi:focus{border-color:#e05c2a;box-shadow:0 0 0 3px rgba(224,92,42,0.1);}
.sd-mi::placeholder{color:#bbb;}
.sd-mta{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;color:#111;outline:none;resize:vertical;min-height:80px;transition:border-color 0.18s;}
.sd-mta:focus{border-color:#e05c2a;box-shadow:0 0 0 3px rgba(224,92,42,0.1);}
.sd-msel{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;color:#111;outline:none;appearance:none;background:#fff;transition:border-color 0.18s;}
.sd-msel:focus{border-color:#e05c2a;}
.sd-mrow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.sd-mf{display:flex;gap:10px;justify-content:flex-end;padding:12px 22px 18px;border-top:1px solid #f0f0ec;}
.sd-btn-c{padding:9px 20px;background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-weight:500;color:#374151;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.18s;}
.sd-btn-c:hover{background:#f9fafb;}
.sd-btn-s{padding:9px 22px;background:#e05c2a;border:none;border-radius:8px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 3px 12px rgba(224,92,42,0.3);transition:background 0.18s;}
.sd-btn-s:hover{background:#c44e1e;}
.sd-btn-s:disabled{opacity:0.6;cursor:not-allowed;}
.sd-dov{position:fixed;inset:0;background:rgba(0,0,0,0.32);z-index:150;animation:sdFd 0.2s ease;}
.sd-drawer{position:fixed;top:0;right:0;bottom:0;width:460px;background:#fff;box-shadow:-8px 0 32px rgba(0,0,0,0.12);display:flex;flex-direction:column;z-index:160;animation:sdDr 0.28s cubic-bezier(0.22,1,0.36,1);}
@keyframes sdDr{from{transform:translateX(100%);}to{transform:translateX(0);}}
.sd-dh{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid #f0f0ec;}
.sd-dt{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#111;}
.sd-db{flex:1;overflow-y:auto;padding:20px 22px;}
.sd-dsec{margin-bottom:20px;}
.sd-dsec-t{font-size:11px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;}
.sd-drow{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;}
.sd-dlbl{font-size:12.5px;color:#bbb;min-width:96px;flex-shrink:0;padding-top:2px;}
.sd-dval{font-size:13.5px;color:#111;font-weight:500;}
.sd-ddesc{font-size:13.5px;color:#374151;line-height:1.65;background:#f9f9f7;border-radius:8px;padding:12px 14px;}
.sd-dfoot{padding:14px 22px;border-top:1px solid #f0f0ec;display:flex;gap:10px;}
.sd-dbtn{flex:1;padding:10px;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.18s;}
.sd-dbtn.pri{background:#e05c2a;border:none;color:#fff;box-shadow:0 3px 10px rgba(224,92,42,0.3);}
.sd-dbtn.pri:hover{background:#c44e1e;}
.sd-dbtn.sec{background:#fff;border:1.5px solid #e5e7eb;color:#374151;}
.sd-dbtn.sec:hover{background:#f9f9f7;}
.sd-toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);background:#111;color:#fff;font-size:13.5px;font-weight:500;padding:10px 20px;border-radius:24px;z-index:9999;white-space:nowrap;animation:sdFd 0.25s ease;box-shadow:0 8px 24px rgba(0,0,0,0.18);}
.sd-toast.ok{background:#16a34a;}
.sd-toast.err{background:#dc2626;}
.sd-spin{display:flex;align-items:center;justify-content:center;min-height:260px;gap:12px;color:#bbb;font-size:14px;}
.sd-ring{width:28px;height:28px;border:3px solid #f0f0ec;border-top-color:#e05c2a;border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
@media(max-width:768px){
  .sd-bottom{grid-template-columns:1fr;}
  .sd-drawer{width:100%;}
  .sd-agent-info{display:none;}
}
`;

const SEED = [
  { id:"#12084",title:"Dashboard loading error on iOS",  meta:"Product: Mobile App • Category: Technical",    requester:"John Doe",          req_type:"Customer",       ini:"JD",col:"#6366f1",st:"in_progress",   pr:"critical", act:"Updated 4m ago",   desc:"The dashboard fails to load on iOS after the latest app update. Users report an infinite spinner." },
  { id:"#12083",title:"Spare parts bulk order request",  meta:"Product: Service Parts • Category: Sales",    requester:"TechCenter Phoenix",req_type:"Service Center",  ini:"TC",col:"#0ea5e9",st:"new",           pr:"medium",   act:"Created 12m ago",  desc:"Service center requesting bulk Q4 spare parts order. Needs sales approval." },
  { id:"#12082",title:"Warranty verification failure",   meta:"Product: Hardware • Category: Warranty",     requester:"Anna Smith",        req_type:"Customer",       ini:"AS",col:"#f59e0b",st:"awaiting_reply", pr:"high",     act:"Updated 1h ago",   desc:"Customer warranty check failing — serial number not found in the system." },
  { id:"#12081",title:"Payment gateway timeout",         meta:"Product: Checkout • Category: Billing",      requester:"Mike K.",           req_type:"Customer",       ini:"MK",col:"#e05c2a",st:"resolved",       pr:"low",      act:"Resolved 3h ago",  desc:"Payment gateway timed out during checkout flow. Issue resolved." },
  { id:"#12080",title:"OTP not delivered to mobile",     meta:"Product: Auth • Category: Technical",        requester:"Sara Lee",          req_type:"Customer",       ini:"SL",col:"#8b5cf6",st:"open",           pr:"high",     act:"Created 2h ago",   desc:"Customer not receiving OTP SMS during login." },
  { id:"#12079",title:"Partner payout delayed 3 weeks",  meta:"Product: Payments • Category: Billing",      requester:"Ravi Motors",       req_type:"Service Center",  ini:"RM",col:"#10b981",st:"escalated",      pr:"urgent",   act:"Escalated 30m ago", desc:"Partner has not received payout for 3 completed bookings. Escalated." },
];

const CHART = [
  {d:"M",h:45,hl:false},{d:"T",h:62,hl:false},{d:"W",h:90,hl:true},
  {d:"T",h:72,hl:false},{d:"F",h:55,hl:false},{d:"S",h:40,hl:false},{d:"S",h:65,hl:false},
];

const authH = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")||""}` });
const api   = (m,url,b) => fetch(`${API_BASE}${url}`,{ method:m, headers:authH(), ...(b?{body:JSON.stringify(b)}:{}) });
 
function stLabel(s){ return ({in_progress:"In Progress",new:"New",awaiting_reply:"Awaiting Reply",resolved:"Resolved",open:"Open",closed:"Closed",escalated:"Escalated"})[s]||s; }
 
function injectStyles() {
  if (!document.getElementById(FONTS_ID)) {
    const l=document.createElement("link");l.id=FONTS_ID;l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById(STYLE_ID)) {
    const s=document.createElement("style");s.id=STYLE_ID;s.textContent=CSS;document.head.appendChild(s);
  }
}
 
const SvgSearch =()=> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const SvgBell   =()=> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SvgGear   =()=> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const SvgChev   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const SvgFilt   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const SvgPlus   =()=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SvgClose  =()=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SvgPrev   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const SvgNext   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const SvgHead   =()=> <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="white"/></svg>;
const SvgTix    =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/></svg>;
const SvgPpl    =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SvgHome   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgWarn   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>;
 
function CreateModal({ onClose, onDone }) {
  const [f,setF] = useState({ title:"",desc:"",priority:"medium",category:"Technical",name:"",rtype:"Customer" });
  const [busy,setBusy] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
 
  const submit = async () => {
    if (!f.title.trim()||!f.name.trim()) return;
    setBusy(true);
    let rawId = null;
    try {
      const r = await api("POST","/complaints/",{ description:`${f.title}\n\n${f.desc}`, priority:f.priority, category:f.category });
      if (r.ok) { const d=await r.json(); rawId=d.id; }
    } catch {}
    onDone({
      id: rawId ? `#${rawId}` : `#${1200+Math.floor(Math.random()*99)}`,
      title:f.title, meta:`Product: App • Category: ${f.category}`,
      requester:f.name, req_type:f.rtype,
      ini:f.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
      col:"#e05c2a", st:"new", pr:f.priority,
      act:"Created just now", desc:f.desc, raw_id:rawId,
    });
    setBusy(false);
  };
 
  return (
    <div className="sd-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sd-modal">
        <div className="sd-mh">
          <span className="sd-mt">Create New Ticket</span>
          <button className="sd-mx" onClick={onClose}><SvgClose /></button>
        </div>
        <div className="sd-mb">
          <div className="sd-mft">
            <label className="sd-ml">Subject / Title *</label>
            <input className="sd-mi" placeholder="e.g. Dashboard loading error on iOS" value={f.title} onChange={e=>set("title",e.target.value)} />
          </div>
          <div className="sd-mrow" style={{marginBottom:14}}>
            <div className="sd-mft" style={{marginBottom:0}}>
              <label className="sd-ml">Requester Name *</label>
              <input className="sd-mi" placeholder="Full name" value={f.name} onChange={e=>set("name",e.target.value)} />
            </div>
            <div className="sd-mft" style={{marginBottom:0}}>
              <label className="sd-ml">Requester Type</label>
              <select className="sd-msel" value={f.rtype} onChange={e=>set("rtype",e.target.value)}>
                <option>Customer</option><option>Service Center</option><option>Partner</option><option>Internal</option>
              </select>
            </div>
          </div>
          <div className="sd-mrow" style={{marginBottom:14}}>
            <div className="sd-mft" style={{marginBottom:0}}>
              <label className="sd-ml">Priority</label>
              <select className="sd-msel" value={f.priority} onChange={e=>set("priority",e.target.value)}>
                <option value="low">Low</option><option value="medium">Medium</option>
                <option value="high">High</option><option value="critical">Critical</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="sd-mft" style={{marginBottom:0}}>
              <label className="sd-ml">Category</label>
              <select className="sd-msel" value={f.category} onChange={e=>set("category",e.target.value)}>
                <option>Technical</option><option>Billing</option><option>Sales</option><option>Warranty</option><option>General</option>
              </select>
            </div>
          </div>
          <div className="sd-mft" style={{marginBottom:0}}>
            <label className="sd-ml">Description</label>
            <textarea className="sd-mta" placeholder="Describe the issue in detail..." value={f.desc} onChange={e=>set("desc",e.target.value)} />
          </div>
        </div>
        <div className="sd-mf">
          <button className="sd-btn-c" onClick={onClose}>Cancel</button>
          <button className="sd-btn-s" onClick={submit} disabled={busy||!f.title.trim()||!f.name.trim()}>
            {busy?"Creating…":"Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
function Drawer({ t, onClose, onResolve }) {
  return (
    <>
      <div className="sd-dov" onClick={onClose}/>
      <div className="sd-drawer">
        <div className="sd-dh">
          <span className="sd-dt">{t.id} — {t.title}</span>
          <button className="sd-mx" onClick={onClose}><SvgClose /></button>
        </div>
        <div className="sd-db">
          <div className="sd-dsec">
            <div className="sd-dsec-t">Ticket Details</div>
            <div className="sd-drow"><span className="sd-dlbl">Status</span><span className="sd-dval"><span className={`sd-st ${t.st}`}><span className="sd-st-dot"/>{stLabel(t.st)}</span></span></div>
            <div className="sd-drow"><span className="sd-dlbl">Priority</span><span className="sd-dval"><span className={`sd-pr ${t.pr}`}>{t.pr.charAt(0).toUpperCase()+t.pr.slice(1)}</span></span></div>
            <div className="sd-drow"><span className="sd-dlbl">Requester</span><span className="sd-dval">{t.requester} <span style={{color:"#bbb",fontSize:12}}>({t.req_type})</span></span></div>
            <div className="sd-drow"><span className="sd-dlbl">Activity</span><span className="sd-dval">{t.act}</span></div>
            <div className="sd-drow"><span className="sd-dlbl">Details</span><span className="sd-dval">{t.meta}</span></div>
          </div>
          <div className="sd-dsec">
            <div className="sd-dsec-t">Description</div>
            <div className="sd-ddesc">{t.desc||"No description provided."}</div>
          </div>
        </div>
        <div className="sd-dfoot">
          <button className="sd-dbtn sec" onClick={onClose}>Close</button>
          {t.st!=="resolved"&&<button className="sd-dbtn pri" onClick={()=>{onResolve(t.id);onClose();}}>Mark Resolved</button>}
        </div>
      </div>
    </>
  );
}
 
export default function SupportDesk() {
  useEffect(()=>{ injectStyles(); },[]);
 
  const [tickets,setTickets] = useState(SEED);
  const [tab,setTab]         = useState("all");
  const [search,setSearch]   = useState("");
  const [page,setPage]       = useState(1);
  const [modal,setModal]     = useState(false);
  const [drawer,setDrawer]   = useState(null);
  const [toast,setToast]     = useState(null);
  const [loading,setLoading] = useState(false);
 
  const PER = 4;
 
  useEffect(()=>{
    setLoading(true);
    api("GET","/complaints/")
      .then(r=>r.ok?r.json():null)
      .then(data=>{
        if (!data) return;
        const list = Array.isArray(data)?data:(data.results||[]);
        if (list.length===0) return;
        setTickets(list.map(c=>({
          id:`#${c.id}`,
          title:(c.description||"").split("\n")[0]||`Ticket #${c.id}`,
          meta:`Status: ${c.status||"open"}`,
          requester:c.user?.full_name||"Customer",
          req_type:c.user?.role||"Customer",
          ini:(c.user?.full_name||"C").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
          col:"#e05c2a",st:c.status||"open",pr:c.priority||"medium",
          act:c.updated_at?`Updated ${new Date(c.updated_at).toLocaleDateString()}`:"Recently",
          desc:c.description||"",raw_id:c.id,
        })));
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);
 
  function toast_(msg,type="ok"){ setToast({msg,type}); setTimeout(()=>setToast(null),2600); }
 
  function onCreated(t){ setTickets(p=>[t,...p]); setModal(false); toast_(`Ticket ${t.id} created.`); }
 
  async function onResolve(tid){
    setTickets(p=>p.map(t=>t.id===tid?{...t,st:"resolved",act:"Resolved just now"}:t));
    toast_(`Ticket ${tid} marked resolved.`);
    const found=tickets.find(t=>t.id===tid);
    if (found?.raw_id) api("PATCH",`/complaints/${found.raw_id}/resolve/`,{resolution_note:"Resolved by agent."}).catch(()=>{});
  }
 
  const filtered = tickets.filter(t=>{
    const ms=!search||t.title.toLowerCase().includes(search.toLowerCase())||t.requester.toLowerCase().includes(search.toLowerCase())||t.id.includes(search);
    const mt=tab==="all"?true:tab==="customer"?t.req_type?.toLowerCase().includes("customer"):tab==="service"?t.req_type?.toLowerCase().includes("service"):tab==="escalated"?t.st==="escalated":true;
    return ms&&mt;
  });
 
  const pages    = Math.max(1,Math.ceil(filtered.length/PER));
  const paged    = filtered.slice((page-1)*PER,page*PER);
  const urgCnt   = tickets.filter(t=>t.pr==="critical"||t.pr==="urgent").length;
  const hiCnt    = tickets.filter(t=>t.pr==="high").length;
  const regCnt   = tickets.filter(t=>t.pr==="medium"||t.pr==="low").length;
  const total    = tickets.length;
  const resCnt   = tickets.filter(t=>t.st==="resolved").length;
  const goalPct  = total>0?Math.round(resCnt/total*100):82;
 
  const TABS=[
    {id:"all",       label:"All Tickets",           count:tickets.length,                                                    icon:<SvgTix/>},
    {id:"customer",  label:"Customer Inquiries",    count:tickets.filter(t=>t.req_type?.toLowerCase().includes("customer")).length, icon:<SvgPpl/>},
    {id:"service",   label:"Service Center Requests",count:tickets.filter(t=>t.req_type?.toLowerCase().includes("service")).length,  icon:<SvgHome/>},
    {id:"escalated", label:"Escalated",             count:tickets.filter(t=>t.st==="escalated").length,                     icon:<SvgWarn/>},
  ];
 
  return (
    <div className="sd-root">
      {toast&&<div className={`sd-toast ${toast.type}`}>{toast.msg}</div>}
      {modal&&<CreateModal onClose={()=>setModal(false)} onDone={onCreated}/>}
      {drawer&&<Drawer t={drawer} onClose={()=>setDrawer(null)} onResolve={onResolve}/>}
 
      <nav className="sd-nav">
        <div className="sd-brand">
          <div className="sd-brand-icon"><SvgHead /></div>
          <span className="sd-brand-name">Support Desk</span>
        </div>
        <div className="sd-search-box">
          <SvgSearch/>
          <input placeholder="Search tickets, customers..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        </div>
        <div className="sd-nav-gap"/>
        <div className="sd-nav-icon"><SvgBell/><span className="sd-notif-dot">{urgCnt}</span></div>
        <div className="sd-nav-icon"><SvgGear/></div>
        <div className="sd-agent">
          <div className="sd-agent-info">
            <div className="sd-agent-name">Alex Rivera</div>
            <div className="sd-agent-role">Senior Agent</div>
          </div>
          <div className="sd-agent-avatar">AR</div>
        </div>
      </nav>
 
      <div className="sd-page">
 
        <div className="sd-tabs">
          {TABS.map(t=>(
            <button key={t.id} className={`sd-tab${tab===t.id?" on":""}`} onClick={()=>{setTab(t.id);setPage(1);}}>
              {t.icon} {t.label}
              {t.count>0&&<span className="sd-tab-pill">{t.count}</span>}
            </button>
          ))}
        </div>
 
        <div className="sd-filters">
          <button className="sd-filt-btn">Status: All Open <SvgChev/></button>
          <button className="sd-filt-btn">Priority: Urgent <SvgChev/></button>
          <button className="sd-filt-btn">Assigned To: Me <SvgChev/></button>
          <button className="sd-more"><SvgFilt/> More Filters</button>
          <div className="sd-gap"/>
          <button className="sd-create" onClick={()=>setModal(true)}><SvgPlus/> Create Ticket</button>
        </div>
 
        <div className="sd-card">
          {loading?(
            <div className="sd-spin"><div className="sd-ring"/> Loading tickets…</div>
          ):(
            <>
              <table className="sd-tbl">
                <thead>
                  <tr>
                    <th style={{width:80}}>ID</th>
                    <th>Subject &amp; Details</th>
                    <th>Requester</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length===0?(
                    <tr><td colSpan={6} style={{textAlign:"center",padding:"40px",color:"#bbb",fontSize:14}}>No tickets found.</td></tr>
                  ):paged.map(t=>(
                    <tr key={t.id} onClick={()=>setDrawer(t)}>
                      <td><span className="sd-tid">{t.id}</span></td>
                      <td>
                        <div className="sd-ttitle">{t.title}</div>
                        <div className="sd-tmeta">{t.meta}</div>
                      </td>
                      <td>
                        <div className="sd-req">
                          <div className="sd-req-av" style={{background:t.col}}>{t.ini}</div>
                          <div>
                            <div className="sd-req-name">{t.requester}</div>
                            <div className="sd-req-type">{t.req_type}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`sd-st ${t.st}`}><span className="sd-st-dot"/>{stLabel(t.st)}</span></td>
                      <td><span className={`sd-pr ${t.pr}`}>{t.pr.charAt(0).toUpperCase()+t.pr.slice(1)}</span></td>
                      <td><span className="sd-act">{t.act}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="sd-tfoot">
                <span className="sd-tfoot-info">Showing {filtered.length===0?0:(page-1)*PER+1} to {Math.min(page*PER,filtered.length)} of {filtered.length} entries</span>
                <div className="sd-pages">
                  <button className="sd-pg" disabled={page===1} onClick={()=>setPage(p=>p-1)}><SvgPrev/></button>
                  {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(n=>(
                    <button key={n} className={`sd-pg${page===n?" on":""}`} onClick={()=>setPage(n)}>{n}</button>
                  ))}
                  {pages>5&&<span style={{color:"#bbb",padding:"0 4px"}}>…</span>}
                  <button className="sd-pg" disabled={page===pages} onClick={()=>setPage(p=>p+1)}><SvgNext/></button>
                </div>
              </div>
            </>
          )}
        </div>
 
        <div className="sd-bottom">
          <div className="sd-prio-card">
            <div className="sd-card-lbl">Tickets by Priority</div>
            {[
              {label:"Urgent/Critical",count:urgCnt, pct:Math.min(100,Math.round(urgCnt/Math.max(total,1)*100)), color:"#ef4444"},
              {label:"High Priority",  count:hiCnt,  pct:Math.min(100,Math.round(hiCnt/Math.max(total,1)*100)),  color:"#f97316"},
              {label:"Regular",        count:regCnt, pct:Math.min(100,Math.round(regCnt/Math.max(total,1)*100)), color:"#e05c2a"},
            ].map(r=>(
              <div className="sd-prow" key={r.label}>
                <div style={{flex:1}}>
                  <div className="sd-pname">{r.label}</div>
                  <div className="sd-ptrack"><div className="sd-pbar" style={{width:`${r.pct}%`,background:r.color}}/></div>
                </div>
                <div className="sd-pnum">{r.count}</div>
              </div>
            ))}
          </div>
 
          <div className="sd-resp-card">
            <div className="sd-card-lbl">Response Time</div>
            <div className="sd-bars">
              {CHART.map((c,i)=>(
                <div className="sd-bc" key={i}>
                  <div className={`sd-b${c.hl?" hl":""}`} style={{height:`${c.h}%`}}/>
                  <span className="sd-bday">{c.d}</span>
                </div>
              ))}
            </div>
            <div className="sd-resp-stat">
              <div className="sd-resp-val">1.2h</div>
              <div className="sd-resp-sub">Average first response</div>
            </div>
          </div>
 
          <div className="sd-goal-card">
            <div className="sd-goal-lbl">Daily Goal</div>
            <div className="sd-goal-pct">{goalPct}%</div>
            <div className="sd-goal-desc">Tickets resolved today. Keep it up!</div>
            <button className="sd-goal-btn">View Reports</button>
          </div>
        </div>
 
      </div>
    </div>
  );
}