import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const FONTS_ID = "scr-fonts";
const STYLE_ID = "scr-styles";

const DEMO = {
  id: 1,
  booking_reference: "FSP-992824",
  status: "completed",
  scheduled_date: "Oct 24, 2023",
  scheduled_time: "10:00 AM",
  created_at: "2023-10-24T10:00:00Z",
  updated_at: "2023-10-24T13:30:00Z",
  total_amount: "149.99",
  service_address: "Bay 4, South Service Center",
  service_latitude: "37.7749",
  service_longitude: "-122.4194",
  customer_name: "Alex Johnson",
  vehicle_name: "Tesla Model 3",
  service_name: "Engine Repair",
  partner_name: "Garrett Mk",
  payment_status: "success",
  notes: "Overall vehicle condition is exceptional. The minor wear on the cabin filter is normal for this mileage. Recommend a full detail next visit to preserve the exterior ceramic coating.",
  service: {
    name: "Engine Repair",
    description: "Complete mechanical diagnostics and heavy-duty restoration work for all types of internal combustion engines.",
  },
  vehicle: { brand: "Tesla", model: "Model 3" },
  commission: {
    platform_amount: "29.99",
    partner_payout: "120.00",
    platform_percentage: "20",
  },
};

const DEMO_TIMELINE = [
  { status: "pending",     note: "Booking created successfully", created_at: "2023-10-24T09:00:00Z" },
  { status: "assigned",    note: "Partner Garrett Mk assigned",  created_at: "2023-10-24T09:15:00Z" },
  { status: "accepted",    note: "Partner accepted the booking", created_at: "2023-10-24T09:30:00Z" },
  { status: "in_progress", note: "Service started at location",  created_at: "2023-10-24T10:05:00Z" },
  { status: "completed",   note: "Service completed successfully", created_at: "2023-10-24T13:30:00Z" },
];

const STYLES = `
.scr-wrap{min-height:100vh;background:#0d1117;font-family:'DM Sans',sans-serif;color:#e6edf3;display:flex;flex-direction:column;}
.scr-demo-bar{background:rgba(251,191,36,0.1);border-bottom:1px solid rgba(251,191,36,0.25);padding:8px 28px;font-size:12px;color:#fbbf24;display:flex;align-items:center;gap:8px;font-weight:500;}
.scr-nav{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:58px;background:#0d1117;border-bottom:1px solid rgba(255,255,255,0.07);position:sticky;top:0;z-index:50;}
.scr-nav-brand{display:flex;align-items:center;gap:9px;}
.scr-nav-dot{width:30px;height:30px;background:#3b82f6;border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.4);}
.scr-nav-name{font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#e6edf3;letter-spacing:-0.2px;}
.scr-nav-actions{display:flex;align-items:center;gap:10px;}
.scr-icon-btn{width:34px;height:34px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#8b949e;transition:background 0.18s,color 0.18s;}
.scr-icon-btn:hover{background:rgba(255,255,255,0.09);color:#e6edf3;}
.scr-print-btn{display:flex;align-items:center;gap:7px;padding:8px 16px;background:#3b82f6;border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 3px 12px rgba(59,130,246,0.35);transition:background 0.18s;}
.scr-print-btn:hover{background:#2563eb;}
.scr-page{flex:1;max-width:900px;width:100%;margin:0 auto;padding:28px 20px 48px;}
.scr-status-chip{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#22c55e;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
.scr-status-chip-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
.scr-top-row{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px;flex-wrap:wrap;}
.scr-title-block{flex:1;}
.scr-main-title{font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:#fff;letter-spacing:-0.6px;margin-bottom:8px;}
.scr-job-meta{display:flex;align-items:center;gap:14px;font-size:13px;color:#8b949e;flex-wrap:wrap;}
.scr-job-id{color:#3b82f6;font-weight:600;}
.scr-meta-dot{width:3px;height:3px;border-radius:50%;background:#484f58;}
.scr-customer-card{display:flex;align-items:center;gap:12px;background:#161b22;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:12px 16px;min-width:220px;}
.scr-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;flex-shrink:0;}
.scr-cust-name{font-size:14px;font-weight:600;color:#e6edf3;margin-bottom:3px;}
.scr-cust-sub{font-size:12px;color:#8b949e;}
.scr-stats-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:26px;}
.scr-stat-card{background:#161b22;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px 20px;position:relative;overflow:hidden;}
.scr-stat-card.hl{background:linear-gradient(135deg,#1d3a6e,#1e3a8a);border-color:rgba(59,130,246,0.3);}
.scr-stat-lbl{font-size:11.5px;color:#8b949e;font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.scr-stat-val{font-family:'Sora',sans-serif;font-size:34px;font-weight:800;color:#fff;line-height:1;}
.scr-stat-val .u{font-size:15px;font-weight:500;color:rgba(255,255,255,0.5);margin-left:2px;}
.scr-stat-badge{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;color:#22c55e;font-weight:600;}
.scr-stat-sub{font-size:12px;color:#8b949e;margin-top:6px;}
.scr-stat-ico{position:absolute;top:14px;right:14px;width:28px;height:28px;background:rgba(255,255,255,0.06);border-radius:7px;display:flex;align-items:center;justify-content:center;color:#8b949e;}
.scr-sections{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
.scr-section{background:#161b22;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;}
.scr-sec-head{display:flex;align-items:center;gap:8px;padding:15px 18px 12px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;font-weight:600;color:#e6edf3;}
.scr-sec-ico{width:22px;height:22px;background:rgba(59,130,246,0.12);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#3b82f6;}
.scr-work-items{padding:12px 18px;display:flex;flex-direction:column;gap:10px;}
.scr-work-item{border-left:2px solid rgba(59,130,246,0.35);padding:10px 12px;background:rgba(59,130,246,0.04);border-radius:0 8px 8px 0;}
.scr-work-name{font-size:13.5px;font-weight:600;color:#e6edf3;margin-bottom:4px;}
.scr-work-desc{font-size:12px;color:#8b949e;line-height:1.55;}
.scr-work-meta{display:flex;align-items:center;gap:10px;margin-top:6px;font-size:11.5px;color:#484f58;}
.scr-work-price{color:#3b82f6;font-weight:600;}
.scr-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:700;}
.scr-pill.completed{background:rgba(34,197,94,0.12);color:#4ade80;}
.scr-pill.pending{background:rgba(251,191,36,0.12);color:#fbbf24;}
.scr-pill.cancelled{background:rgba(248,113,113,0.12);color:#f87171;}
.scr-pill.in_progress{background:rgba(59,130,246,0.12);color:#60a5fa;}
.scr-pill.assigned{background:rgba(168,85,247,0.12);color:#c084fc;}
.scr-pill.accepted{background:rgba(34,197,94,0.08);color:#86efac;}
.scr-pill-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}
.scr-tech-note{margin:0 18px 18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;}
.scr-tech-note-lbl{font-size:11px;font-weight:700;color:#484f58;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.scr-tech-note-q{font-size:13px;color:#c9d1d9;line-height:1.6;font-style:italic;margin-bottom:8px;}
.scr-tech-sig{font-size:12px;color:#3b82f6;font-weight:500;}
.scr-timeline{padding:12px 18px;display:flex;flex-direction:column;}
.scr-tl-item{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
.scr-tl-item:last-child{border-bottom:none;}
.scr-tl-dot{width:10px;height:10px;border-radius:50%;background:#484f58;flex-shrink:0;margin-top:3px;}
.scr-tl-dot.completed{background:#22c55e;}
.scr-tl-dot.pending{background:#fbbf24;}
.scr-tl-dot.in_progress{background:#3b82f6;}
.scr-tl-dot.assigned,.scr-tl-dot.accepted{background:#c084fc;}
.scr-tl-status{font-size:13px;font-weight:600;color:#e6edf3;margin-bottom:3px;text-transform:capitalize;}
.scr-tl-note{font-size:12px;color:#8b949e;}
.scr-tl-time{font-size:11px;color:#484f58;margin-left:auto;flex-shrink:0;white-space:nowrap;}
.scr-payment-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
.scr-pay-card{background:#161b22;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px 20px;}
.scr-pay-label{font-size:11px;font-weight:700;color:#484f58;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;}
.scr-pay-val{font-family:'Sora',sans-serif;font-size:28px;font-weight:700;color:#fff;}
.scr-pay-val .currency{font-size:14px;color:#8b949e;margin-right:3px;}
.scr-pay-ok{display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:12px;font-weight:600;color:#22c55e;}
.scr-commission-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;}
.scr-comm-item{background:rgba(255,255,255,0.03);border-radius:8px;padding:10px 12px;}
.scr-comm-label{font-size:11px;color:#484f58;margin-bottom:4px;}
.scr-comm-val{font-size:15px;font-weight:700;color:#e6edf3;}
.scr-banner{position:relative;border-radius:14px;overflow:hidden;margin-bottom:20px;height:200px;}
.scr-banner img{width:100%;height:100%;object-fit:cover;object-position:center 60%;filter:brightness(0.55);}
.scr-banner-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.18) 65%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px 28px;}
.scr-banner-ready{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:#fff;margin-bottom:6px;}
.scr-banner-sub{font-size:13.5px;color:rgba(255,255,255,0.7);}
.scr-footer{text-align:center;padding:16px;font-size:12px;color:#484f58;border-top:1px solid rgba(255,255,255,0.04);}
.scr-loading{display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:14px;color:#8b949e;}
.scr-spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,0.07);border-top-color:#3b82f6;border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
@media(max-width:640px){
  .scr-stats-row,.scr-sections,.scr-payment-row{grid-template-columns:1fr;}
  .scr-top-row{flex-direction:column;}
  .scr-main-title{font-size:24px;}
}
@media print{.scr-nav-actions,.scr-demo-bar{display:none;}}
`;

function setupStyles() {
  if (!document.getElementById(FONTS_ID)) {
    const l = document.createElement("link");
    l.id = FONTS_ID; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID; s.textContent = STYLES;
    document.head.appendChild(s);
  }
}

function authFetch(url) {
  const token = localStorage.getItem("token") || "";
  return fetch(`${API_BASE}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function fmt(d) {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); }
  catch { return d; }
}

function fmtTime(d) {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }); }
  catch { return d; }
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function statusClass(s) {
  const v = (s || "").toLowerCase().replace(" ","_");
  return ["completed","pending","cancelled","in_progress","assigned","accepted"].includes(v) ? v : "pending";
}

const CAR = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80&fit=crop";

const IcTruck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>;
const IcShare = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IcUser = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcPrint = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const IcCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcWrench = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IcClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcNote = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcCard = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IcInfo = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#fbbf24"/></svg>;

function Pill({ status }) {
  const cls = statusClass(status);
  const label = (status || "pending").replace("_"," ");
  return <span className={`scr-pill ${cls}`}><span className="scr-pill-dot"/>{label.charAt(0).toUpperCase()+label.slice(1)}</span>;
}

export default function ServiceCompletionReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking,   setBooking]   = useState(null);
  const [timeline,  setTimeline]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [isDemo,    setIsDemo]    = useState(false);

  useEffect(() => { setupStyles(); }, []);

  useEffect(() => {
    setupStyles();
    if (!id) {
      setBooking(DEMO); setTimeline(DEMO_TIMELINE); setIsDemo(true); setLoading(false);
      return;
    }
    loadData(id);
  }, [id]);

  async function loadData(bookingId) {
    setLoading(true);
    try {
      const [bRes, tRes] = await Promise.all([
        authFetch(`/bookings/${bookingId}/`),
        authFetch(`/bookings/${bookingId}/timeline/`),
      ]);

      if (bRes.ok) {
        const bData = await bRes.json();
        setBooking(bData);
        setIsDemo(false);
        if (tRes.ok) {
          const tData = await tRes.json();
          setTimeline(Array.isArray(tData) ? tData : (tData.results || []));
        }
      } else {
        setBooking(DEMO); setTimeline(DEMO_TIMELINE); setIsDemo(true);
      }
    } catch {
      setBooking(DEMO); setTimeline(DEMO_TIMELINE); setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="scr-wrap">
        <div className="scr-loading">
          <div className="scr-spinner"/>
          <span>Loading report…</span>
        </div>
      </div>
    );
  }

  const b            = booking;
  const custName     = b.customer_name   || b.customer?.full_name   || "N/A";
  const vehicleName  = b.vehicle_name    || `${b.vehicle?.brand||""} ${b.vehicle?.model||""}`.trim() || "N/A";
  const serviceName  = b.service_name    || b.service?.name         || "N/A";
  const serviceDesc  = b.service?.description                       || "Doorstep vehicle service performed at your location.";
  const partnerName  = b.partner_name    || b.partner?.full_name    || "N/A";
  const status       = b.status          || "completed";
  const totalAmt     = parseFloat(b.total_amount || 0).toFixed(2);
  const payStatus    = b.payment_status  || b.payment?.payment_status || "pending";
  const ref          = b.booking_reference || `#${b.id}`;
  const address      = b.service_address || "Service location";
  const comm         = b.commission;
  const partnerPay   = comm ? parseFloat(comm.partner_payout  || 0).toFixed(2) : null;
  const platformAmt  = comm ? parseFloat(comm.platform_amount || 0).toFixed(2) : null;
  const platformPct  = comm?.platform_percentage || "20";

  return (
    <div className="scr-wrap">

      {isDemo && (
        <div className="scr-demo-bar">
          <IcInfo/>
          Demo mode — Django backend offline. Connect your backend and visit <strong>/report/&#123;booking_id&#125;</strong> to see live data.
        </div>
      )}

      <nav className="scr-nav">
        <div className="scr-nav-brand">
          <div className="scr-nav-dot"><IcTruck /></div>
          <span className="scr-nav-name">ServicePro</span>
        </div>
        <div className="scr-nav-actions">
          <button className="scr-icon-btn"><IcShare /></button>
          <button className="scr-icon-btn"><IcUser /></button>
          <button className="scr-print-btn" onClick={() => window.print()}>
            <IcPrint /> Print Report
          </button>
        </div>
      </nav>

      <div className="scr-page">

        <div className="scr-status-chip">
          <span className="scr-status-chip-dot"/>
          {status === "completed" ? "Service Completed" : status.replace("_"," ")}
        </div>

        <div className="scr-top-row">
          <div className="scr-title-block">
            <h1 className="scr-main-title">Vehicle Health Report</h1>
            <div className="scr-job-meta">
              <span>Booking: <span className="scr-job-id">{ref}</span></span>
              <span className="scr-meta-dot"/>
              <span>{b.scheduled_date || fmt(b.created_at)}</span>
              {b.scheduled_time && <><span className="scr-meta-dot"/><span>{b.scheduled_time}</span></>}
            </div>
          </div>
          <div className="scr-customer-card">
            <div className="scr-avatar">{getInitials(custName)}</div>
            <div>
              <div className="scr-cust-name">{custName}</div>
              <div className="scr-cust-sub">{vehicleName}</div>
            </div>
          </div>
        </div>

        <div className="scr-stats-row">

          <div className="scr-stat-card hl">
            <div className="scr-stat-lbl"><IcWrench /> Service Performed</div>
            <div className="scr-stat-ico" style={{background:"rgba(59,130,246,0.15)",color:"#3b82f6"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700,color:"#fff",marginTop:4,lineHeight:1.3}}>{serviceName}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:6,lineHeight:1.5}}>{serviceDesc}</div>
          </div>

          <div className="scr-stat-card">
            <div className="scr-stat-lbl"><IcClock /> Booking Status</div>
            <div className="scr-stat-ico">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div style={{marginTop:6}}><Pill status={status}/></div>
            {status === "completed" && (
              <div className="scr-stat-badge" style={{marginTop:10}}>
                <IcCheck /> Service Complete
              </div>
            )}
            <div className="scr-stat-sub" style={{marginTop:8}}>Partner: {partnerName}</div>
          </div>

          <div className="scr-stat-card">
            <div className="scr-stat-lbl"><IcCard /> Total Amount</div>
            <div className="scr-stat-ico"><IcCard /></div>
            <div className="scr-stat-val"><span className="u">$</span>{totalAmt}</div>
            <div className="scr-stat-sub" style={{marginTop:6}}>
              Payment:&nbsp;
              <span style={{color: payStatus==="success"?"#22c55e":"#fbbf24", fontWeight:600}}>
                {payStatus}
              </span>
            </div>
          </div>

        </div>

        <div className="scr-sections">

          <div className="scr-section">
            <div className="scr-sec-head">
              <div className="scr-sec-ico"><IcWrench /></div>
              Summary of Work
            </div>
            <div className="scr-work-items">
              <div className="scr-work-item">
                <div className="scr-work-name">{serviceName}</div>
                <div className="scr-work-desc">{serviceDesc}</div>
                <div className="scr-work-meta">
                  <span>Vehicle: {vehicleName}</span>
                  <span>•</span>
                  <span className="scr-work-price">${totalAmt}</span>
                </div>
              </div>
              {comm && (
                <div className="scr-work-item" style={{borderColor:"rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.03)"}}>
                  <div className="scr-work-name" style={{color:"#4ade80"}}>Commission Breakdown</div>
                  <div className="scr-commission-row">
                    <div className="scr-comm-item">
                      <div className="scr-comm-label">Platform ({platformPct}%)</div>
                      <div className="scr-comm-val">${platformAmt}</div>
                    </div>
                    <div className="scr-comm-item">
                      <div className="scr-comm-label">Partner Payout</div>
                      <div className="scr-comm-val" style={{color:"#4ade80"}}>${partnerPay}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {b.notes && (
              <div className="scr-tech-note">
                <div className="scr-tech-note-lbl"><IcNote /> Service Note</div>
                <div className="scr-tech-note-q">"{b.notes}"</div>
                <div className="scr-tech-sig">— {partnerName}</div>
              </div>
            )}
          </div>

          <div className="scr-section">
            <div className="scr-sec-head">
              <div className="scr-sec-ico"><IcClock /></div>
              Booking Timeline
            </div>
            {timeline.length > 0 ? (
              <div className="scr-timeline">
                {timeline.map((t,i) => (
                  <div className="scr-tl-item" key={i}>
                    <div className={`scr-tl-dot ${statusClass(t.status)}`}/>
                    <div style={{flex:1}}>
                      <div className="scr-tl-status">{(t.status||"").replace("_"," ")}</div>
                      {t.note && <div className="scr-tl-note">{t.note}</div>}
                    </div>
                    <div className="scr-tl-time">{fmtTime(t.created_at)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding:"20px 18px",fontSize:13,color:"#484f58",textAlign:"center"}}>
                No timeline entries.
              </div>
            )}
          </div>

        </div>

        <div className="scr-payment-row">
          <div className="scr-pay-card">
            <div className="scr-pay-label">Service Location</div>
            <div style={{fontSize:14,color:"#e6edf3",fontWeight:500,lineHeight:1.6}}>{address}</div>
            {b.service_latitude && (
              <div style={{fontSize:12,color:"#484f58",marginTop:6}}>
                {b.service_latitude}, {b.service_longitude}
              </div>
            )}
          </div>
          <div className="scr-pay-card">
            <div className="scr-pay-label">Payment Summary</div>
            <div className="scr-pay-val"><span className="currency">$</span>{totalAmt}</div>
            {payStatus === "success"
              ? <div className="scr-pay-ok"><IcCheck /> Payment Received</div>
              : <div style={{marginTop:8,fontSize:12,color:"#fbbf24",fontWeight:600}}>Payment {payStatus}</div>
            }
          </div>
        </div>

        <div className="scr-banner">
          <img src={CAR} alt="Vehicle ready"/>
          <div className="scr-banner-overlay">
            <div className="scr-banner-ready">
              {status === "completed" ? "Your car is ready." : `Status: ${status}.`}
            </div>
            <div className="scr-banner-sub">{address}</div>
          </div>
        </div>

      </div>

      <footer className="scr-footer">
        © 2024 ServicePro Automotive Systems. All rights reserved.
      </footer>

    </div>
  );
}
