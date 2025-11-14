import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * DatabaseHeartbeat - Silent component that keeps Supabase database active
 * 
 * Writes a heartbeat entry every 2 days to prevent database from being paused
 * after 8 days of inactivity (Supabase free tier limitation).
 * 
 * Setup: Create a 'heartbeat' table in Supabase with this SQL:
 * 
 * CREATE TABLE heartbeat (
 *   id BIGSERIAL PRIMARY KEY,
 *   timestamp TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export function DatabaseHeartbeat() {
  useEffect(() => {
    const HEARTBEAT_INTERVAL = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    const STORAGE_KEY = "db_heartbeat_last_ping";

    const sendHeartbeat = async () => {
      try {
        const { error } = await supabase
          .from("heartbeat")
          .insert([{ timestamp: new Date().toISOString() }]);

        if (error) {
          console.warn("Heartbeat ping failed:", error);
        } else {
          console.log("Database heartbeat sent successfully");
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
      } catch (err) {
        console.warn("Heartbeat error:", err);
      }
    };

    const checkAndSendHeartbeat = () => {
      try {
        const lastPing = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();

        if (!lastPing || now - parseInt(lastPing, 10) >= HEARTBEAT_INTERVAL) {
          sendHeartbeat();
        }
      } catch (err) {
        console.warn("Heartbeat check error:", err);
      }
    };

    // Check immediately on mount
    checkAndSendHeartbeat();

    // Set up interval to check every 12 hours (will only send if 2 days passed)
    const intervalId = setInterval(checkAndSendHeartbeat, 12 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component renders nothing
}
