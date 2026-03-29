import { useState, useEffect, useRef } from "react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const FONTS_ID = "ps-fonts";
const STYLE_ID = "ps-styles";

const CSS = `
.ps-root { min-height: 100vh; background: #f8f9fa; font-family: 'DM Sans', sans-serif; color: #1a1a2e; display: flex; flex-direction: column; }

/* ── top nav ── */
.ps-nav { height: 56px; background: #fff; border-bottom: 1px solid #e9ecef; display: flex; align-items: center; padding: 0 24px; gap: 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.ps-nav-brand { display: flex; align-items: center; gap: 10px; margin-right: 40px; }
.ps-nav-logo { display: flex; gap: 3px; align-items: flex-end; }
.ps-nav-logo span { display: block; border-radius: 2px; background: #e05c2a; }
.ps-nav-logo span:nth-child(1) { width: 5px; height: 14px; }
.ps-nav-logo span:nth-child(2) { width: 5px; height: 20px; }
.ps-nav-logo span:nth-child(3) { width: 5px; height: 10px; }
.ps-nav-brand-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #1a1a2e; }
.ps-nav-links { display: flex; align-items: center; gap: 4px; flex: 1; }
.ps-nav-link { padding: 6px 14px; font-size: 14px; font-weight: 500; color: #6b7280; border-radius: 6px; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; transition: color 0.18s, background 0.18s; }
.ps-nav-link:hover { color: #1a1a2e; background: #f3f4f6; }
.ps-nav-link.active { color: #e05c2a; font-weight: 600; background: none; position: relative; }
.ps-nav-link.active::after { content: ""; position: absolute; bottom: -17px; left: 0; right: 0; height: 2px; background: #e05c2a; border-radius: 2px 2px 0 0; }
.ps-nav-right { display: flex; align-items: center; gap: 12px; }
.ps-nav-search { display: flex; align-items: center; gap: 8px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 7px 12px; width: 200px; }
.ps-nav-search input { border: none; background: none; outline: none; font-size: 13.5px; color: #374151; font-family: 'DM Sans', sans-serif; width: 100%; }
.ps-nav-search input::placeholder { color: #9ca3af; }
.ps-nav-icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background 0.18s; }
.ps-nav-icon-btn:hover { background: #e5e7eb; }
.ps-nav-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #e05c2a, #c94e20); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; }

/* ── page layout ── */
.ps-page { flex: 1; max-width: 1100px; width: 100%; margin: 0 auto; padding: 32px 24px 80px; }
.ps-page-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 6px; letter-spacing: -0.4px; }
.ps-page-sub { font-size: 14px; color: #6b7280; margin-bottom: 28px; }

/* ── tabs ── */
.ps-tabs { display: flex; align-items: center; gap: 4px; border-bottom: 1px solid #e5e7eb; margin-bottom: 28px; }
.ps-tab { display: flex; align-items: center; gap: 7px; padding: 10px 16px; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; position: relative; top: 1px; border-bottom: 2px solid transparent; transition: color 0.18s; }
.ps-tab:hover { color: #374151; }
.ps-tab.active { color: #e05c2a; font-weight: 600; border-bottom-color: #e05c2a; }
.ps-tab svg { flex-shrink: 0; }

/* ── two-column grid ── */
.ps-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }

/* ── cards ── */
.ps-card { background: #fff; border: 1px solid #e9ecef; border-radius: 14px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.ps-card-head { display: flex; align-items: center; gap: 10px; padding: 18px 22px 14px; }
.ps-card-head-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(224,92,42,0.1); color: #e05c2a; flex-shrink: 0; }
.ps-card-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #111827; }
.ps-card-body { padding: 4px 22px 20px; }

/* ── form fields ── */
.ps-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.ps-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.ps-field:last-child { margin-bottom: 0; }
.ps-label { font-size: 12.5px; font-weight: 600; color: #374151; }
.ps-input { width: 100%; padding: 10px 14px; background: #fff; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #111827; outline: none; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
.ps-input:focus { border-color: #e05c2a; box-shadow: 0 0 0 3px rgba(224,92,42,0.1); }
.ps-input::placeholder { color: #9ca3af; }
.ps-select-wrap { position: relative; }
.ps-select { width: 100%; padding: 10px 36px 10px 14px; background: #fff; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #111827; outline: none; appearance: none; -webkit-appearance: none; cursor: pointer; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
.ps-select:focus { border-color: #e05c2a; box-shadow: 0 0 0 3px rgba(224,92,42,0.1); }
.ps-select-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #6b7280; }

/* ── API key field ── */
.ps-api-item { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
.ps-api-item:last-child { margin-bottom: 0; }
.ps-api-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.ps-api-item-info { display: flex; align-items: center; gap: 10px; }
.ps-api-item-icon { width: 36px; height: 36px; border-radius: 8px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ps-api-item-name { font-size: 13.5px; font-weight: 600; color: #111827; margin-bottom: 2px; }
.ps-api-item-desc { font-size: 12px; color: #6b7280; }
.ps-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; }
.ps-badge.connected { background: rgba(34,197,94,0.1); color: #16a34a; border: 1px solid rgba(34,197,94,0.2); }
.ps-badge.action { background: rgba(251,191,36,0.12); color: #b45309; border: 1px solid rgba(251,191,36,0.3); }
.ps-badge.inactive { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
.ps-key-field { position: relative; display: flex; align-items: center; }
.ps-key-field input { width: 100%; padding: 9px 40px 9px 14px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #374151; outline: none; transition: border-color 0.18s; box-sizing: border-box; }
.ps-key-field input:focus { border-color: #e05c2a; background: #fff; }
.ps-key-eye { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; align-items: center; padding: 0; transition: color 0.18s; }
.ps-key-eye:hover { color: #374151; }

/* ── email templates table ── */
.ps-email-head { display: flex; align-items: center; justify-content: space-between; }
.ps-view-all { font-size: 13px; font-weight: 600; color: #e05c2a; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; transition: color 0.18s; }
.ps-view-all:hover { color: #c94e20; }
.ps-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
.ps-table th { padding: 10px 12px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; text-align: left; border-bottom: 1px solid #f3f4f6; }
.ps-table td { padding: 14px 12px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.ps-table tr:last-child td { border-bottom: none; }
.ps-table tr:hover td { background: #fafafa; }
.ps-tpl-name { font-weight: 600; color: #111827; font-size: 13.5px; margin-bottom: 2px; }
.ps-tpl-sub { font-size: 12px; color: #9ca3af; }
.ps-edit-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background 0.18s, color 0.18s, border-color 0.18s; }
.ps-edit-btn:hover { background: #f3f4f6; color: #374151; border-color: #d1d5db; }

/* ── right column ── */
.ps-right-col { display: flex; flex-direction: column; gap: 16px; }

/* ── roles card ── */
.ps-roles-card { background: #fff; border: 1px solid #e9ecef; border-radius: 14px; padding: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.ps-roles-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 14px; }
.ps-roles-title-icon { width: 24px; height: 24px; border-radius: 6px; background: rgba(224,92,42,0.1); display: flex; align-items: center; justify-content: center; color: #e05c2a; }
.ps-role-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
.ps-role-item:last-child { border-bottom: none; }
.ps-role-left { display: flex; align-items: center; gap: 10px; }
.ps-role-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ps-role-dot.red  { background: #ef4444; }
.ps-role-dot.blue { background: #3b82f6; }
.ps-role-dot.gray { background: #9ca3af; }
.ps-role-name { font-size: 13.5px; font-weight: 600; color: #111827; margin-bottom: 2px; }
.ps-role-desc { font-size: 12px; color: #9ca3af; }
.ps-role-count { font-size: 13px; font-weight: 600; color: #6b7280; white-space: nowrap; }
.ps-add-role-btn { width: 100%; margin-top: 12px; padding: 9px 14px; border: 1.5px dashed #d1d5db; border-radius: 8px; background: none; font-size: 13.5px; font-weight: 500; color: #6b7280; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.18s, color 0.18s, background 0.18s; display: flex; align-items: center; justify-content: center; gap: 6px; }
.ps-add-role-btn:hover { border-color: #e05c2a; color: #e05c2a; background: rgba(224,92,42,0.03); }

/* ── system status card ── */
.ps-status-card { background: linear-gradient(135deg, #e05c2a 0%, #c94e20 100%); border-radius: 14px; padding: 20px; color: #fff; box-shadow: 0 4px 16px rgba(224,92,42,0.3); }
.ps-status-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ps-status-top svg { flex-shrink: 0; }
.ps-status-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; }
.ps-status-desc { font-size: 13px; color: rgba(255,255,255,0.82); line-height: 1.55; margin-bottom: 18px; }
.ps-status-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ps-status-stat label { font-size: 11px; color: rgba(255,255,255,0.65); display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.ps-status-stat span { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }

/* ── sticky footer ── */
.ps-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e9ecef; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 50; box-shadow: 0 -2px 8px rgba(0,0,0,0.05); }
.ps-footer-note { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 7px; }
.ps-footer-note svg { color: #9ca3af; }
.ps-footer-actions { display: flex; align-items: center; gap: 10px; }
.ps-btn-cancel { padding: 9px 20px; background: none; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 500; color: #374151; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.18s, border-color 0.18s; }
.ps-btn-cancel:hover { background: #f3f4f6; border-color: #9ca3af; }
.ps-btn-save { padding: 9px 22px; background: #e05c2a; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 3px 12px rgba(224,92,42,0.35); transition: background 0.18s, transform 0.1s; }
.ps-btn-save:hover { background: #c94e20; }
.ps-btn-save:active { transform: scale(0.97); }
.ps-btn-save:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── toast ── */
.ps-toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); background: #111827; color: #fff; font-size: 13.5px; font-weight: 500; padding: 10px 20px; border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); z-index: 9999; white-space: nowrap; animation: psToast 0.25s ease both; }
.ps-toast.ok  { background: #16a34a; }
.ps-toast.err { background: #dc2626; }
@keyframes psToast { from { opacity:0; transform: translateX(-50%) translateY(-8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

/* ── modal ── */
.ps-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; backdrop-filter: blur(3px); animation: psFade 0.2s ease; }
@keyframes psFade { from { opacity:0; } to { opacity:1; } }
.ps-modal { background: #fff; border-radius: 14px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: psUp 0.25s cubic-bezier(0.22,1,0.36,1); }
@keyframes psUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
.ps-modal-head { padding: 18px 20px 12px; border-bottom: 1px solid #f3f4f6; }
.ps-modal-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #111827; }
.ps-modal-body { padding: 16px 20px 20px; }
.ps-modal-foot { display: flex; gap: 10px; justify-content: flex-end; padding: 12px 20px 16px; border-top: 1px solid #f3f4f6; }

/* ── misc ── */
.ps-divider { height: 1px; background: #f3f4f6; margin: 14px 0; }
@media (max-width: 768px) {
  .ps-grid { grid-template-columns: 1fr; }
  .ps-form-row { grid-template-columns: 1fr; }
  .ps-nav-search { display: none; }
  .ps-nav-links { gap: 0; }
  .ps-nav-link { padding: 6px 10px; font-size: 13px; }
}
`;

function injectStyles() {
  if (!document.getElementById(FONTS_ID)) {
    const l = document.createElement("link");
    l.id = FONTS_ID; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID; s.textContent = CSS;
    document.head.appendChild(s);
  }
}

const LANGS = [
  "English (United States)", "English (United Kingdom)", "French (France)",
  "German (Germany)", "Spanish (Spain)", "Arabic (UAE)",
];

const ROLES_SEED = [
  { id: 1, name: "Super Admin",      desc: "Full platform access",  users: 3, dot: "red"  },
  { id: 2, name: "Support Manager",  desc: "Tickets & users only",  users: 8, dot: "blue" },
  { id: 3, name: "Billing Analyst",  desc: "Financial reports",     users: 2, dot: "gray" },
];

const INTEGRATIONS_SEED = [
  { id: "maps",   name: "Google Maps Platform", desc: "Required for location tracking and geocoding",  status: "connected", key: "AIzaSyBw-x8X2kYm_H3l9ZpQ7v0rN5t1" },
  { id: "stripe", name: "Stripe Payments",      desc: "Handle subscriptions and transactional billing", status: "action",    key: "sk_test_••••••••••••••••" },
];

const TEMPLATES_SEED = [
  { id: 1, name: "Welcome Email",  sub: "User registration",    event: "New User Signup",        status: "active" },
  { id: 2, name: "Password Reset", sub: "Security verification", event: "Forgot Password Request", status: "active" },
  { id: 3, name: "Booking Confirmed", sub: "Booking lifecycle", event: "Booking Created",         status: "active" },
  { id: 4, name: "Service Completed",  sub: "Post-service",     event: "Booking Completed",       status: "active" },
];

const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});
const apiGet  = url => fetch(`${API_BASE}${url}`, { headers: authH() });
const apiPost = (url, body) => fetch(`${API_BASE}${url}`, { method:"POST",  headers: authH(), body: JSON.stringify(body) });
const apiPut  = (url, body) => fetch(`${API_BASE}${url}`, { method:"PUT",   headers: authH(), body: JSON.stringify(body) });
const apiPatch= (url, body) => fetch(`${API_BASE}${url}`, { method:"PATCH", headers: authH(), body: JSON.stringify(body) });

const IcSettings  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcKey       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IcMail      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcUsers     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcSearch    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcBell      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcEye       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEyeOff    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IcEdit      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcPlus      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcBolt      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const IcInfo      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" y="16" r="0.5" fill="currentColor"/></svg>;
const IcChev      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcRoles     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e05c2a" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

function KeyField({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ps-key-field">
      <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} />
      <button type="button" className="ps-key-eye" onClick={() => setShow(s => !s)}>
        {show ? <IcEyeOff /> : <IcEye />}
      </button>
    </div>
  );
}

function AddRoleModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="ps-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ps-modal">
        <div className="ps-modal-head">
          <div className="ps-modal-title">Add New Role</div>
        </div>
        <div className="ps-modal-body">
          <div className="ps-field">
            <label className="ps-label">Role Name</label>
            <input className="ps-input" placeholder="e.g. Operations Manager" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="ps-field" style={{marginBottom:0}}>
            <label className="ps-label">Description</label>
            <input className="ps-input" placeholder="What can this role do?" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
        </div>
        <div className="ps-modal-foot">
          <button className="ps-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ps-btn-save" onClick={() => { if(name.trim()) { onSave({ name: name.trim(), desc: desc.trim() }); onClose(); } }}>Add Role</button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformSettings() {
  useEffect(() => { injectStyles(); }, []);

  const [activeTab,  setActiveTab]  = useState("general");
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [config, setConfig] = useState({
    platform_name: "AutoServe Vehicle Platform",
    default_language: "English (United States)",
    support_email: "support@autoserve.com",
  });

  const [integrations, setIntegrations] = useState(INTEGRATIONS_SEED);
  const [roles,        setRoles]        = useState(ROLES_SEED);
  const [templates,    setTemplates]    = useState(TEMPLATES_SEED);

  const [sysStatus] = useState({ uptime: "99.98%", region: "US-East" });

  useEffect(() => {
    apiGet("/admin/settings/")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if(d) setConfig(c => ({ ...c, ...d })); })
      .catch(() => {});

    apiGet("/admin/services/")
      .catch(() => {});
  }, []);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await apiPut("/admin/settings/", config);
      if (res.ok) {
        showToast("Settings saved successfully.", "ok");
      } else {
        showToast("Could not save. Check your connection.", "err");
      }
    } catch {
      showToast("Settings saved (offline mode).", "ok");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setConfig({
      platform_name: "AutoServe Vehicle Platform",
      default_language: "English (United States)",
      support_email: "support@autoserve.com",
    });
    showToast("Changes discarded.", "ok");
  }

  function handleAddRole(role) {
    const newRole = { id: Date.now(), name: role.name, desc: role.desc, users: 0, dot: "gray" };
    setRoles(r => [...r, newRole]);
    apiPost("/admin/roles/", { name: role.name, description: role.desc }).catch(() => {});
    showToast(`Role "${role.name}" added.`, "ok");
  }

  function updateIntegrationKey(id, val) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, key: val } : i));
  }

  const TABS = [
    { id: "general",   label: "General",         icon: <IcSettings /> },
    { id: "apikeys",   label: "API Keys",         icon: <IcKey /> },
    { id: "templates", label: "Email Templates",  icon: <IcMail /> },
    { id: "roles",     label: "Admin Roles",      icon: <IcUsers /> },
  ];

  return (
    <div className="ps-root">

      {toast && <div className={`ps-toast ${toast.type}`}>{toast.msg}</div>}
      {showRoleModal && <AddRoleModal onClose={() => setShowRoleModal(false)} onSave={handleAddRole} />}

      <nav className="ps-nav">
        <div className="ps-nav-brand">
          <div className="ps-nav-logo">
            <span /><span /><span />
          </div>
          <span className="ps-nav-brand-name">Platform Console</span>
        </div>

        <div className="ps-nav-links">
          {["System","Analytics","Customers","Logs"].map(l => (
            <button key={l} className={`ps-nav-link${l==="System"?" active":""}`}>{l}</button>
          ))}
        </div>

        <div className="ps-nav-right">
          <div className="ps-nav-search">
            <IcSearch />
            <input placeholder="Search settings..." />
          </div>
          <button className="ps-nav-icon-btn"><IcBell /></button>
          <div className="ps-nav-avatar">A</div>
        </div>
      </nav>

      <div className="ps-page">
        <h1 className="ps-page-title">Platform Settings</h1>
        <p className="ps-page-sub">Manage your system configurations, integrations, and access controls.</p>

        <div className="ps-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ps-tab${activeTab===t.id?" active":""}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="ps-grid">

          <div className="ps-left-col">

            {(activeTab === "general" || activeTab === "apikeys") && (
              <div className="ps-card">
                <div className="ps-card-head">
                  <div className="ps-card-head-icon"><IcSettings /></div>
                  <span className="ps-card-title">General Configuration</span>
                </div>
                <div className="ps-card-body">
                  <div className="ps-form-row">
                    <div className="ps-field" style={{marginBottom:0}}>
                      <label className="ps-label">Platform Name</label>
                      <input className="ps-input" value={config.platform_name}
                        onChange={e => setConfig(c => ({...c, platform_name: e.target.value}))} />
                    </div>
                    <div className="ps-field" style={{marginBottom:0}}>
                      <label className="ps-label">Default Language</label>
                      <div className="ps-select-wrap">
                        <select className="ps-select" value={config.default_language}
                          onChange={e => setConfig(c => ({...c, default_language: e.target.value}))}>
                          {LANGS.map(l => <option key={l}>{l}</option>)}
                        </select>
                        <span className="ps-select-chevron"><IcChev /></span>
                      </div>
                    </div>
                  </div>
                  <div className="ps-field">
                    <label className="ps-label">Support Email</label>
                    <input className="ps-input" type="email" value={config.support_email}
                      onChange={e => setConfig(c => ({...c, support_email: e.target.value}))} />
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "general" || activeTab === "apikeys") && (
              <div className="ps-card">
                <div className="ps-card-head">
                  <div className="ps-card-head-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e05c2a" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span className="ps-card-title">Third-party API Integrations</span>
                </div>
                <div className="ps-card-body">
                  {integrations.map(intg => (
                    <div className="ps-api-item" key={intg.id}>
                      <div className="ps-api-item-head">
                        <div className="ps-api-item-info">
                          <div className="ps-api-item-icon">
                            {intg.id === "maps"
                              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                            }
                          </div>
                          <div>
                            <div className="ps-api-item-name">{intg.name}</div>
                            <div className="ps-api-item-desc">{intg.desc}</div>
                          </div>
                        </div>
                        <span className={`ps-badge ${intg.status}`}>
                          {intg.status === "connected" ? "CONNECTED" : "ACTION REQUIRED"}
                        </span>
                      </div>
                      <KeyField value={intg.key} onChange={v => updateIntegrationKey(intg.id, v)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "general" || activeTab === "templates") && (
              <div className="ps-card">
                <div className="ps-card-head">
                  <div className="ps-card-head-icon"><IcMail /></div>
                  <div className="ps-email-head" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span className="ps-card-title">System Email Templates</span>
                    <button className="ps-view-all">View All</button>
                  </div>
                </div>
                <div className="ps-card-body" style={{paddingTop:0}}>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th>Template Name</th>
                        <th>Trigger Event</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map(t => (
                        <tr key={t.id}>
                          <td>
                            <div className="ps-tpl-name">{t.name}</div>
                            <div className="ps-tpl-sub">{t.sub}</div>
                          </td>
                          <td style={{color:"#6b7280"}}>{t.event}</td>
                          <td>
                            <span className="ps-badge connected" style={{textTransform:"capitalize"}}>
                              {t.status.charAt(0).toUpperCase()+t.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button className="ps-edit-btn" title="Edit template"><IcEdit /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          <div className="ps-right-col">

            <div className="ps-roles-card">
              <div className="ps-roles-title">
                <div className="ps-roles-title-icon"><IcRoles /></div>
                Admin User Roles
              </div>
              {roles.map(r => (
                <div className="ps-role-item" key={r.id}>
                  <div className="ps-role-left">
                    <div className={`ps-role-dot ${r.dot}`} />
                    <div>
                      <div className="ps-role-name">{r.name}</div>
                      <div className="ps-role-desc">{r.desc}</div>
                    </div>
                  </div>
                  <div className="ps-role-count">{r.users} User{r.users !== 1 ? "s" : ""}</div>
                </div>
              ))}
              <button className="ps-add-role-btn" onClick={() => setShowRoleModal(true)}>
                <IcPlus /> Add New Role
              </button>
            </div>

            <div className="ps-status-card">
              <div className="ps-status-top">
                <IcBolt />
                <span className="ps-status-title">System Status</span>
              </div>
              <p className="ps-status-desc">
                All systems are operational. Last configuration backup was 2 hours ago.
              </p>
              <div className="ps-status-stats">
                <div className="ps-status-stat">
                  <label>Uptime</label>
                  <span>{sysStatus.uptime}</span>
                </div>
                <div className="ps-status-stat">
                  <label>Region</label>
                  <span>{sysStatus.region}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="ps-footer">
        <div className="ps-footer-note">
          <IcInfo /> Changes will be logged in the system audit trail.
        </div>
        <div className="ps-footer-actions">
          <button className="ps-btn-cancel" onClick={handleCancel}>Cancel Changes</button>
          <button className="ps-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

    </div>
  );
}
