import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CustomCalendar } from "../components/custom-calendar";
import { Calendar, Clock, User, Sparkles, LogOut, Ban, XCircle } from "lucide-react";
import HeaderImg from "../Bilder/Header.png";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  time: string;
  date: string; // ISO date string from Supabase
}

interface BlockedSlot {
  id: string;
  date: string;
  time?: string; // undefined means whole day is blocked
  reason?: string;
}

interface DashboardProps {
  onLogout: () => void;
}

// Helper function to format date as YYYY-MM-DD in local timezone
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockMode, setBlockMode] = useState<"day" | "range">("day");
  const [blockDate, setBlockDate] = useState<Date>(new Date());
  const [blockTime, setBlockTime] = useState<string>("");
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date());
  const [rangeEndDate, setRangeEndDate] = useState<Date | undefined>(undefined);
  const [showTimeSelection, setShowTimeSelection] = useState(false);

  const timeSlots = [
    "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00",
    "16:00", "17:00"
  ];

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Fehler beim Laden der Buchungen");
      return;
    }
    setBookings(data ?? []);
  };

  // Fetch blocked slots from Supabase
  const fetchBlockedSlots = async () => {
    const { data, error } = await supabase.from("blocked_slots").select("*");
    if (error) {
      console.error("Error fetching blocked slots:", error);
      return;
    }
    setBlockedSlots(data ?? []);
  };

  useEffect(() => {
    fetchBookings();
    fetchBlockedSlots();

    const handler = () => {
      fetchBookings();
      fetchBlockedSlots();
    };
    window.addEventListener("bookingCreated", handler as EventListener);
    return () => window.removeEventListener("bookingCreated", handler as EventListener);
  }, []);

  // Filter bookings for selected date
  const selectedBookings = bookings.filter((booking) => {
    const d = new Date(booking.date);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Soll diese Buchung wirklich gelöscht werden?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      console.error("Error deleting booking:", error);
      toast.error("Fehler beim Löschen der Buchung");
      return;
    }
    toast.success("Buchung gelöscht");
    fetchBookings();
  };

  const handleBlockSlot = async () => {
    if (blockMode === "range" && !rangeEndDate) {
      toast.error("Bitte wählen Sie ein Enddatum");
      return;
    }

    if (showTimeSelection && !blockTime) {
      toast.error("Bitte wählen Sie eine Uhrzeit");
      return;
    }

    try {
      // Load existing blocked slots to prevent duplicates
      const existingRes = await supabase.from("blocked_slots").select("date, time");
      if (existingRes.error) throw existingRes.error;
      const existing = existingRes.data ?? [];
      const existingSet = new Set<string>();
      for (const s of existing) {
        try {
          const d = new Date(s.date);
          existingSet.add(`${formatDateLocal(d)}|${s.time}`);
        } catch (e) {
          // ignore parsing errors
        }
      }

      if (showTimeSelection) {
        // Block single time slot on specific date
        const dateAtMidnight = new Date(blockDate);
        dateAtMidnight.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        const key = `${formatDateLocal(dateAtMidnight)}|${blockTime}`;
        if (existingSet.has(key)) {
          toast.error(`Zeitslot ${blockTime} am ${blockDate.toLocaleDateString("de-DE")} ist bereits blockiert`);
        } else {
          const { error } = await supabase.from("blocked_slots").insert([{
            date: dateAtMidnight.toISOString(),
            time: blockTime,
            reason: null
          }]);
          if (error) throw error;
          toast.success(`Zeitslot ${blockTime} am ${blockDate.toLocaleDateString("de-DE")} blockiert`);
          try { window.dispatchEvent(new CustomEvent('blockedSlotsChanged')); } catch (e) { /* ignore */ }
        }
      } else if (blockMode === "day") {
        // Block entire day (all time slots)
        const dateAtMidnight = new Date(blockDate);
        dateAtMidnight.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        const slots = timeSlots.map(time => ({
          date: dateAtMidnight.toISOString(),
          time: time,
          reason: null
        }));
        // Filter out already existing
        const toInsert = slots.filter(s => {
          const key = `${formatDateLocal(new Date(s.date))}|${s.time}`;
          return !existingSet.has(key);
        });
        if (toInsert.length === 0) {
          toast.error("Alle Zeitslots dieses Tages sind bereits blockiert");
        } else {
          const { error } = await supabase.from("blocked_slots").insert(toInsert);
          if (error) throw error;
          toast.success(`Ganzer Tag ${blockDate.toLocaleDateString("de-DE")} blockiert`);
          try { window.dispatchEvent(new CustomEvent('blockedSlotsChanged')); } catch (e) { /* ignore */ }
        }
      } else if (blockMode === "range" && rangeEndDate) {
        // Block date range (all days, all time slots)
        const slots: Array<{date:string,time:string,reason:any}> = [];
        const currentDate = new Date(rangeStartDate);
        const endDate = new Date(rangeEndDate);
        
        while (currentDate <= endDate) {
          const dateAtMidnight = new Date(currentDate);
          dateAtMidnight.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
          for (const time of timeSlots) {
            slots.push({
              date: dateAtMidnight.toISOString(),
              time: time,
              reason: null
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        // Filter out already existing
        const toInsert = slots.filter(s => {
          const key = `${formatDateLocal(new Date(s.date))}|${s.time}`;
          return !existingSet.has(key);
        });
        if (toInsert.length === 0) {
          toast.error("Alle Zeitslots im gewählten Zeitraum sind bereits blockiert");
        } else {
          const { error } = await supabase.from("blocked_slots").insert(toInsert);
          if (error) throw error;
          const days = Math.ceil((endDate.getTime() - rangeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          toast.success(`Zeitraum blockiert (${days} Tage)`);
          try { window.dispatchEvent(new CustomEvent('blockedSlotsChanged')); } catch (e) { /* ignore */ }
        }
      }

      setShowBlockDialog(false);
      setShowTimeSelection(false);
      setBlockTime("");
      setRangeEndDate(undefined);
      fetchBlockedSlots();
    } catch (error) {
      console.error("Error blocking slot:", error);
      toast.error("Fehler beim Blockieren");
    }
  };

  const handleUnblockSlot = async (id: string) => {
    const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
    if (error) {
      console.error("Error unblocking slot:", error);
      toast.error("Fehler beim Freigeben");
      return;
    }
    toast.success("Zeitslot freigegeben");
    fetchBlockedSlots();
    try { window.dispatchEvent(new CustomEvent('blockedSlotsChanged')); } catch (e) { /* ignore */ }
  };

  // Get blocked slots for selected date
  const selectedDateBlocked = blockedSlots.filter((slot) => {
    const d = new Date(slot.date);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Find next available date (has at least one free timeslot)
  const findNextAvailableDate = (fromDate: Date = new Date()) => {
    const maxDays = 365;
    for (let i = 0; i < maxDays; i++) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const dateStr = formatDateLocal(d);

      const bookedTimes = bookings
        .filter(b => (b.date || '').split('T')[0] === dateStr)
        .map(b => b.time);

      const blockedTimesForDay = blockedSlots
        .filter(s => {
          try {
            return formatDateLocal(new Date(s.date)) === dateStr;
          } catch (e) {
            return false;
          }
        })
        .map(s => s.time);

      const allTimes = [...bookedTimes, ...blockedTimesForDay].filter(Boolean) as string[];
      const unavailable = new Set<string>(allTimes);
      if (unavailable.size < timeSlots.length) {
        setSelectedDate(d);
        toast.success(`Nächster freier Termin: ${d.toLocaleDateString('de-DE')}`);
        return d;
      }
    }
    toast.error('Kein verfügbarer Termin innerhalb der nächsten 12 Monate gefunden');
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={HeaderImg} alt="Head Spa" className="h-10 object-contain" />
            <div className="h-8 w-px bg-white/20"></div>
            <h1 className="text-white text-xl font-light">Buchungsverwaltung</h1>
          </div>
          <Button
            onClick={onLogout}
            className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 px-4 py-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ paddingTop: 'calc(var(--header-height, 96px) + 32px)', paddingBottom: '120px' }} className="px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Calendar */}
            <Card className="bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border border-white/10 p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h3 className="text-white text-xl">Datum auswählen</h3>
                </div>
                <Button
                  onClick={() => findNextAvailableDate(new Date())}
                  className="bg-transparent hover:bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 text-sm px-3 py-2"
                >
                  Nächster freier Termin
                </Button>
              </div>
              <div className="flex justify-center">
                <CustomCalendar
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </div>
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Gewähltes Datum: <span className="text-[#FFD700] font-medium">
                      {selectedDate.toLocaleDateString("de-DE", { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {selectedBookings.length} Buchung{selectedBookings.length !== 1 ? "en" : ""} für diesen Tag
                  </p>
                </div>
                <Button
                  onClick={() => setShowBlockDialog(true)}
                  className="w-full bg-transparent hover:bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 py-6"
                >
                  <Ban className="w-4 h-4 mr-2 text-[#FFD700]" />
                  Zeitslots blockieren
                </Button>
              </div>
            </Card>

            {/* Right Column - Bookings List */}
            <Card className="bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border border-white/10 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                </div>
                <h3 className="text-white text-xl">Reservierungen</h3>
              </div>

              {selectedBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Keine Buchungen für diesen Tag</p>
                </div>
              ) : (
                <div className="space-y-4 pr-2">
                  {selectedBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-zinc-950/50 border border-white/5 rounded-lg p-5 hover:border-[#FFD700]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-[#FFD700]" />
                            <h4 className="text-white font-medium">{booking.name}</h4>
                          </div>
                          <p className="text-gray-400 text-sm">{booking.service}, {booking.email}, {booking.phone}</p>
                        </div>
                        <div className="bg-[#FFD700]/10 px-3 py-1 rounded-full">
                          <span className="text-[#FFD700] font-semibold text-sm">{booking.time} Uhr</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant={undefined}
                          onClick={() => handleDelete(booking.id)}
                          className="bg-transparent border border-white/10 text-white px-3 py-1 text-sm hover:bg-[#FFD700]/10"
                          aria-label={`Lösche Buchung ${booking.id}`}
                        >
                          Löschen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Blocked Slots Section */}
          {selectedDateBlocked.length > 0 && (
            <Card className="bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border border-white/10 p-10 backdrop-blur-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-800/30 rounded-lg mt-1">
                    <Ban className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h3 className="text-white text-xl mt-0.5">Blockierte Zeitslots für {selectedDate.toLocaleDateString("de-DE")}</h3>
                </div>
                <Button
                  onClick={async () => {
                    if (!confirm(`Alle ${selectedDateBlocked.length} blockierten Zeitslots für diesen Tag freigeben?`)) return;
                    for (const slot of selectedDateBlocked) {
                      await handleUnblockSlot(slot.id);
                    }
                  }}
                  className="bg-transparent hover:bg-zinc-800/10 text-[#FFD700] border border-[#FFD700]/20 text-sm px-4 py-2"
                >
                  Alle freigeben
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-4">
                {selectedDateBlocked.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-zinc-900/60 border border-white/10 rounded-lg py-3 px-4 relative group hover:bg-zinc-900/70 transition-all cursor-pointer flex items-center justify-center"
                    onClick={() => handleUnblockSlot(slot.id)}
                    title="Klicken zum Freigeben"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white" />
                      <p className="text-white font-medium text-sm pr-6">{slot.time}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity bg-zinc-800/60 rounded-full p-1">
                      <XCircle className="w-4 h-4 text-[#FFD700]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Block Dialog */}
      {showBlockDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/20 p-8 max-w-md w-full">
            <h3 className="text-white text-xl mb-6">Zeitslots blockieren</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Blockierungstyp</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      setBlockMode("day");
                      setShowTimeSelection(false);
                    }}
                    className={blockMode === "day" && !showTimeSelection ? "bg-[#FFD700] text-black" : "bg-zinc-800 text-white"}
                  >
                    Ganzer Tag
                  </Button>
                  <Button
                    onClick={() => {
                      setBlockMode("range");
                      setShowTimeSelection(false);
                    }}
                    className={blockMode === "range" ? "bg-[#FFD700] text-black" : "bg-zinc-800 text-white"}
                  >
                    Zeitraum
                  </Button>
                </div>
              </div>

              {blockMode === "day" && (
                <>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Datum auswählen</label>
                    <input
                      type="date"
                      value={formatDateLocal(blockDate)}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        setBlockDate(new Date(year, month - 1, day, 12, 0, 0, 0));
                      }}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg p-3"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => setShowTimeSelection(!showTimeSelection)}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                    >
                      {showTimeSelection ? "Ganzen Tag blockieren" : "Bestimmte Zeitslots auswählen"}
                    </Button>
                  </div>
                  {showTimeSelection && (
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Zeitslot auswählen</label>
                      <select
                        value={blockTime}
                        onChange={(e) => setBlockTime(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg p-3"
                      >
                        <option value="">Bitte wählen...</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time} Uhr</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {blockMode === "range" && (
                <>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Von (Startdatum)</label>
                    <input
                      type="date"
                      value={formatDateLocal(rangeStartDate)}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        setRangeStartDate(new Date(year, month - 1, day, 12, 0, 0, 0));
                      }}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg p-3"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Bis (Enddatum)</label>
                    <input
                      type="date"
                      value={rangeEndDate ? formatDateLocal(rangeEndDate) : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [year, month, day] = e.target.value.split('-').map(Number);
                          setRangeEndDate(new Date(year, month - 1, day, 12, 0, 0, 0));
                        } else {
                          setRangeEndDate(undefined);
                        }
                      }}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg p-3"
                      min={formatDateLocal(rangeStartDate)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBlockSlot}
                className="flex-1 bg-transparent hover:bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
              >
                Blockieren
              </Button>
              <Button
                onClick={() => {
                  setShowBlockDialog(false);
                  setShowTimeSelection(false);
                  setBlockTime("");
                  setRangeEndDate(undefined);
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Abbrechen
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
