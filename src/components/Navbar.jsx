// src/components/Navbar.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  // 🔔 Alerts state
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [daysFilter, setDaysFilter] = useState(30); // 15 or 30
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [expiring, setExpiring] = useState([]); // [{licenseKey,softwareName,daysRemaining}]
  const isLoggedIn = Boolean(user?.token);

  const severeCount = useMemo(
    () => expiring.filter((x) => x.daysRemaining <= 10).length,
    [expiring]
  );

  const fetchExpiring = async (days = daysFilter) => {
    if (!isLoggedIn) return;
    try {
      setLoadingAlerts(true);
      const res = await api.get(`/licenses/expiring?days=${days}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setExpiring(data);

      // 🔁 Gentle heads-up if anything is very close
      const critical = data.filter((d) => d.daysRemaining <= 10);
      if (critical.length > 0) {
        toast.warning(
          `⚠️ ${critical.length} license${critical.length > 1 ? "s" : ""} expiring in ≤10 days!`
        );
      }
    } catch (e) {
      console.error("Failed to load expiring licenses:", e);
      toast.error("❌ Could not load expiring licenses.");
    } finally {
      setLoadingAlerts(false);
    }
  };

  // ⏱️ Auto-refresh every 60s while logged in (and on filter change)
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchExpiring(daysFilter);
    const id = setInterval(() => fetchExpiring(daysFilter), 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, daysFilter]);

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setAlertsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="nav-glass">
        <div className="nav-left">
          <Link className="brand-logo" to="/">
            License<span>Tracker</span>
          </Link>
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <Link className={`nav-btn ${isActive("/login")}`} to="/login">
                Login
              </Link>
              <Link className={`nav-btn ${isActive("/signup")}`} to="/signup">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link className={`nav-btn ${isActive("/dashboard")}`} to="/dashboard">
                Dashboard
              </Link>

              {["ADMIN", "ENGINEER"].includes(user.role?.toUpperCase?.()) && (
                <>
                  <Link className={`nav-btn ${isActive("/devices")}`} to="/devices">
                    Devices
                  </Link>
                  <Link className={`nav-btn ${isActive("/licenses")}`} to="/licenses">
                    Licenses
                  </Link>
                  <Link className={`nav-btn ${isActive("/assignments")}`} to="/assignments">
                    Assignments
                  </Link>
                </>
              )}

              {/* 🔔 Alerts button */}
              <button
                type="button"
                className="nav-btn bell-btn"
                onClick={() => setAlertsOpen(true)}
                aria-label="View expiring licenses"
                title="Expiring Licenses"
              >
                {/* Bell Icon (SVG) */}
                <svg
                  className="bell-icn"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z"
                    fill="currentColor"
                    opacity="0.85"
                  />
                  <path
                    d="M9 18a3 3 0 006 0H9z"
                    fill="currentColor"
                    opacity="0.65"
                  />
                </svg>

                {/* Badge */}
                {(expiring?.length ?? 0) > 0 && (
                  <span className={`alert-badge ${severeCount ? "danger" : ""}`}>
                    {expiring.length}
                  </span>
                )}
              </button>

              <button className="nav-btn danger" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 🔔 Alerts Modal */}
      {alertsOpen && (
        <div className="alerts-overlay" onClick={() => setAlertsOpen(false)}>
          <div
            className="alerts-modal popup"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alertsTitle"
          >
            <div className="alerts-header">
              <h3 id="alertsTitle">License Alerts</h3>

              <div className="alerts-filters">
                <button
                  className={`chip ${daysFilter === 15 ? "chip-active" : ""}`}
                  onClick={() => setDaysFilter(15)}
                >
                  15 Days
                </button>
                <button
                  className={`chip ${daysFilter === 30 ? "chip-active" : ""}`}
                  onClick={() => setDaysFilter(30)}
                >
                  30 Days
                </button>
              </div>

              <button className="close-x" onClick={() => setAlertsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="alerts-body">
              {loadingAlerts ? (
                <div className="spinner-wrap">
                  <div className="spinner" />
                  <span>Loading expiring licenses…</span>
                </div>
              ) : expiring.length === 0 ? (
                <div className="empty-state">No licenses expiring in the next {daysFilter} days.</div>
              ) : (
                <ul className="alerts-list">
                  {expiring
                    .sort((a, b) => a.daysRemaining - b.daysRemaining)
                    .map((lic) => {
                      const urgency =
                        lic.daysRemaining <= 7
                          ? "urg-red"
                          : lic.daysRemaining <= 15
                          ? "urg-amber"
                          : "urg-yellow";
                      return (
                        <li key={lic.licenseKey} className="alert-row">
                          <div className="alert-left">
                            <div className="lic-key">{lic.licenseKey}</div>
                            <div className="soft-name">{lic.softwareName}</div>
                          </div>
                          <div className={`pill ${urgency}`}>
                            {lic.daysRemaining}d left
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>

            <div className="alerts-footer">
              <Link to="/licenses" className="nav-btn go-manage" onClick={() => setAlertsOpen(false)}>
                Manage Licenses
              </Link>
              <button className="nav-btn ghost" onClick={() => fetchExpiring(daysFilter)}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
