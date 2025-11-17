import { useState, useEffect } from "react";
import { CustomCalendar } from "./custom-calendar";
import useInView from "./ui/useInView";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, CheckCircle2 } from "lucide-react";
import CustomSelect from "./custom-select";
import { supabase } from "../lib/supabaseClient";

const services = [
  { value: "kleine", label: "Kleine Auszeit (45 Min.) - €60" },
  { value: "mittlere", label: "Mittlere Auszeit (65 Min.) - €85" },
  { value: "grosse", label: "Die große Auszeit (80 Min.) - €110" }
];

const timeSlots = [
  "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00"
];

export function BookingSection() {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedTimeSlotsForDate, setBookedTimeSlotsForDate] = useState<string[]>([]);
  const [fullyBlockedDates, setFullyBlockedDates] = useState<Set<string>>(new Set());
  const [bookedDate, setBookedDate] = useState<Date | undefined>(undefined);
  const [bookedTime, setBookedTime] = useState<string>("");

  // Fetch booked time slots when date changes
  useEffect(() => {
    if (!date) {
      setBookedTimeSlotsForDate([]);
      return;
    }

    // Reset booking success message when user changes date after booking
    if (isBooked) {
      setIsBooked(false);
    }

    const fetchBookedSlots = async () => {
      try {
        // Use YYYY-MM-DD format for comparison
        const dateStr = formatLocal(date);

        // Fetch bookings from public view (no customer data) and blocked slots
        const [bookingsResult, blockedResult] = await Promise.all([
          supabase
            .from("public_bookings")
            .select("time, date"),
          supabase
            .from("blocked_slots")
            .select("time, date")
        ]);

        if (bookingsResult.error) {
          console.error("Error fetching booked slots:", bookingsResult.error);
          return;
        }

        if (blockedResult.error) {
          console.error("Error fetching blocked slots:", blockedResult.error);
          return;
        }

        // Filter for selected date on client side
        const bookedTimes = bookingsResult.data
          ?.filter(booking => booking.date.split('T')[0] === dateStr)
          .map((booking) => booking.time) || [];
        
        const blockedTimes = blockedResult.data
          ?.filter(slot => slot.date.split('T')[0] === dateStr)
          .map((slot) => slot.time) || [];
        
        // Combine both booked and blocked times
        const unavailableTimes = [...new Set([...bookedTimes, ...blockedTimes])];
        console.log("Unavailable times for", dateStr, ":", unavailableTimes);
        setBookedTimeSlotsForDate(unavailableTimes);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      }
    };

    fetchBookedSlots();
  }, [date]);

  // Fetch blocked slots to compute fully blocked days (days where all timeSlots are blocked)
  useEffect(() => {
    let mounted = true;
    const fetchFullyBlocked = async () => {
      try {
        // Fetch both blocked_slots and public_bookings (no customer data)
        const [blockedRes, bookingsRes] = await Promise.all([
          supabase.from('blocked_slots').select('date, time'),
          supabase.from('public_bookings').select('date, time')
        ]);

        if (blockedRes.error) {
          console.error('Error fetching blocked_slots for full-day check:', blockedRes.error);
          // continue — we might still compute from bookings
        }
        if (bookingsRes.error) {
          console.error('Error fetching bookings for full-day check:', bookingsRes.error);
          // continue — we might still compute from blocked slots
        }

        const counts: Record<string, number> = {};

        const addToCounts = (rows: any[] | null | undefined) => {
          for (const s of (rows ?? [])) {
            try {
              const dateStr = (s.date || '').split('T')[0];
              if (!dateStr) continue;
              counts[dateStr] = (counts[dateStr] || 0) + 1;
            } catch (e) {
              // ignore malformed rows
            }
          }
        };

        addToCounts(blockedRes.data);
        addToCounts(bookingsRes.data);

        const fullSet = new Set<string>();
        for (const [k, v] of Object.entries(counts)) {
          if (v >= timeSlots.length) fullSet.add(k);
        }

        if (mounted) setFullyBlockedDates(fullSet);
      } catch (err) {
        console.error('Error computing fully blocked dates:', err);
      }
    };

    fetchFullyBlocked();

    const handler = () => fetchFullyBlocked();
    window.addEventListener('blockedSlotsChanged', handler as EventListener);
    window.addEventListener('bookingCreated', handler as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('blockedSlotsChanged', handler as EventListener);
      window.removeEventListener('bookingCreated', handler as EventListener);
    };
  }, []);

  // Find next available appointment (up to 365 days)
  const findNextAvailable = async () => {
    try {
      // Start from January 8, 2026
      const startDate = new Date(2026, 0, 8); // January 8, 2026
      startDate.setHours(0, 0, 0, 0);

      const end = new Date(startDate);
      end.setDate(startDate.getDate() + 365);
      end.setHours(23, 59, 59, 999);

      // Iterate day-by-day and fetch bookings+blocked for that specific day
      for (let i = 0; i <= 365; i++) {
        const cand = new Date(startDate);
        cand.setDate(startDate.getDate() + i);
        cand.setHours(0, 0, 0, 0);
        
        // Only allow Tuesday (2) and Friday (5)
        const dayOfWeek = cand.getDay();
        if (dayOfWeek !== 2 && dayOfWeek !== 5) {
          continue;
        }
        
        const dayStart = new Date(cand);
        const dayEnd = new Date(cand);
        dayEnd.setHours(23, 59, 59, 999);

        // Fetch full lists and filter client-side by YYYY-MM-DD to match calendar logic
        const [bookingsRes, blockedRes] = await Promise.all([
          supabase.from("bookings").select("time, date"),
          supabase.from("blocked_slots").select("time, date")
        ]);

        if (bookingsRes.error || blockedRes.error) {
          console.error("Error fetching slots for", cand, bookingsRes.error || blockedRes.error);
          // skip this day and continue searching
          continue;
        }

        const candStr = formatLocal(cand);
        const bookedTimes = (bookingsRes.data ?? [])
          .filter((b: any) => b.date?.split('T')?.[0] === candStr)
          .map((b: any) => b.time)
          .filter(Boolean) as string[];
        const blockedTimes = (blockedRes.data ?? [])
          .filter((b: any) => b.date?.split('T')?.[0] === candStr)
          .map((b: any) => b.time)
          .filter(Boolean) as string[];
        const unavailable = new Set([...bookedTimes, ...blockedTimes]);

        for (const t of timeSlots) {
          if (!unavailable.has(t)) {
            const selectedNoon = new Date(cand.getFullYear(), cand.getMonth(), cand.getDate(), 12, 0, 0, 0);
            setDate(selectedNoon);
            setSelectedTime(t);
            return;
          }
        }
      }

      toast.error("Kein freier Termin in den nächsten 365 Tagen gefunden");
    } catch (err) {
      console.error("Error finding next available:", err);
      toast.error("Fehler beim Suchen nach freien Terminen");
    }
  };

  const handleBooking = async () => {
    if (!date || !selectedTime || !selectedService || !formData.name || !formData.email || !formData.phone) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    setIsBooking(true);

    try {
      // Check if time slot is still available (race condition protection)
      const dateStr = formatLocal(date);

      // Check both bookings and blocked slots
      const [bookingsResult, blockedResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("time, date"),
        supabase
          .from("blocked_slots")
          .select("time, date")
      ]);

      if (bookingsResult.error || blockedResult.error) {
        console.error("Error checking availability:", bookingsResult.error || blockedResult.error);
        toast.error("Fehler beim Prüfen der Verfügbarkeit. Bitte versuchen Sie es erneut.");
        setIsBooking(false);
        return;
      }

      // Check if slot is already booked or blocked for this date
      const isBooked = bookingsResult.data?.some(
        booking => booking.date.split('T')[0] === dateStr && booking.time === selectedTime
      );
      
      const isBlocked = blockedResult.data?.some(
        slot => slot.date.split('T')[0] === dateStr && slot.time === selectedTime
      );

      if (isBooked || isBlocked) {
        toast.error("Dieser Zeitslot ist nicht mehr verfügbar. Bitte wählen Sie eine andere Uhrzeit.");
        setIsBooking(false);
        setSelectedTime("");
        // Refresh available slots
        setBookedTimeSlotsForDate([...bookedTimeSlotsForDate, selectedTime]);
        return;
      }

      const serviceLabel = services.find((s) => s.value === selectedService)?.label ?? selectedService;
      
      // Set date to noon to avoid timezone issues
      const dateAtMidnight = new Date(date);
      dateAtMidnight.setHours(12, 0, 0, 0);
      
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: serviceLabel,
        time: selectedTime,
        date: dateAtMidnight.toISOString()
      } as any;

      const { data, error } = await supabase.from("bookings").insert([payload]).select();
      
      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Fehler beim Speichern der Buchung. Bitte versuchen Sie es erneut.");
        setIsBooking(false);
        return;
      }

      // Success — set state and notify other parts of the app
      setIsBooked(true);
      setIsBooking(false);
      
      // Save the booked date and time for display
      setBookedDate(date);
      setBookedTime(selectedTime);

      // Make sure the just-booked time is reflected in the available slots immediately
      try {
        const bookedTimeSlot = selectedTime;
        setBookedTimeSlotsForDate((prev) => Array.from(new Set([...(prev || []), bookedTimeSlot])));
      } catch (e) {
        // ignore
      }

      // Clear form data after successful booking
      setFormData({ name: "", email: "", phone: "" });
      setSelectedTime("");
      setSelectedService("");

      // notify admin dashboard to refresh
      try {
        window.dispatchEvent(new CustomEvent("bookingCreated", { detail: data?.[0] }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      setIsBooking(false);
    }
  };

  // Listen for service selections from other parts of the app (e.g. Services cards)
  useEffect(() => {
    // On mount, pick up any prefilled service from sessionStorage
    try {
      const pre = sessionStorage.getItem("bookingService");
      if (pre) {
        setSelectedService(pre);
        sessionStorage.removeItem("bookingService");
      }
    } catch (e) {
      // ignore
    }

    const handler = (e: Event) => {
      const svc = (e as CustomEvent).detail as string | undefined;
      if (svc) setSelectedService(svc);
    };
    window.addEventListener("bookingService", handler as EventListener);
    return () => window.removeEventListener("bookingService", handler as EventListener);
  }, []);

  return (
    <section id="booking" className="py-32 px-4 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          {(() => {
            const { ref, inView } = useInView<HTMLDivElement>();
            return (
              <div 
                ref={ref} 
                className="transition-all duration-700"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(30px)'
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]"></div>
                  <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Termin buchen</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FFD700]"></div>
                </div>
                <h2 className="text-white mb-6">Buchen Sie Ihr Head Spa Erlebnis</h2>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                  Wählen Sie Ihren Wunschtermin und genießen Sie luxuriöse Entspannung. 
                  Wir freuen uns darauf, Sie zu verwöhnen.
                </p>
              </div>
            );
          })()}
        </div>

        <Card className="bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border border-white/10 p-10 backdrop-blur-xl shadow-[0_0_80px_rgba(255,215,0,0.1)]">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Calendar & Time Selection */}
            {(() => {
              const { ref, inView } = useInView<HTMLDivElement>();
              return (
                <div 
                  ref={ref}
                  className="space-y-8 transition-all duration-700"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : 'translateX(-30px)'
                  }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-[#FFD700]" />
                      </div>
                      <Label className="text-white text-lg">Wählen Sie ein Datum</Label>
                    </div>
                    <div className="flex justify-center bg-zinc-950/50 rounded-2xl p-6 border border-white/5">
                      <CustomCalendar
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => {
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          // Block all dates before 08.01.2026
                          const startDate = new Date(2026, 0, 8); // January 8, 2026
                          startDate.setHours(0,0,0,0);
                          // Block past dates and dates before start date
                          const minDate = today > startDate ? today : startDate;
                          if (d < minDate) return true;
                          
                          // Allow all of January 2026, otherwise limit to 4 weeks from today
                          const endOfJanuary2026 = new Date(2026, 1, 1); // February 1, 2026 (exclusive)
                          endOfJanuary2026.setHours(0,0,0,0);
                          const fourWeeksFromToday = new Date(today);
                          fourWeeksFromToday.setDate(today.getDate() + 28); // 4 weeks = 28 days
                          fourWeeksFromToday.setHours(23,59,59,999);
                          
                          // If today is before Feb 2026, allow all of January
                          const maxDate = today < endOfJanuary2026 ? endOfJanuary2026 : fourWeeksFromToday;
                          if (d >= maxDate) return true;
                          
                          // Only allow Tuesday (2) and Friday (5)
                          const dayOfWeek = d.getDay();
                          if (dayOfWeek !== 2 && dayOfWeek !== 5) return true;
                          const dayStr = formatLocal(d);
                          return fullyBlockedDates.has(dayStr);
                        }}
                      />
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={findNextAvailable}
                        className="bg-transparent text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/5 px-4 py-2"
                      >
                        Nächster freier Termin
                      </Button>
                    </div>
                  </div>

                  {date && (
                    <div className="animate-[fadeIn_0.5s_ease-in]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                          <Clock className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        <Label className="text-white text-lg">Verfügbare Uhrzeiten</Label>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((time) => {
                          const isBooked = bookedTimeSlotsForDate.includes(time);
                          return (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "ghost"}
                              className={
                                isBooked
                                  ? "relative overflow-visible bg-transparent border border-white/6 text-white/80 cursor-not-allowed py-6 opacity-50"
                                  : selectedTime === time
                                  ? "bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black border-0 shadow-[0_0_20px_rgba(255,215,0,0.3)] py-6"
                                  : "bg-zinc-950/50 border border-white/6 text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/5 py-6"
                              }
                              onClick={() => !isBooked && setSelectedTime(time)}
                              disabled={isBooked}
                              aria-label={isBooked ? `${time} belegt` : `${time} verfügbar`}
                            >
                              <div className="flex flex-col items-center">
                                {isBooked ? (
                                  <span
                                    className="relative z-10 text-white/90"
                                    style={{
                                      textDecoration: 'line-through',
                                      textDecorationColor: 'rgba(255,215,0,0.75)',
                                      textDecorationThickness: '2px',
                                      textDecorationSkipInk: 'none'
                                    }}
                                  >
                                    {time}
                                  </span>
                                ) : (
                                  <span className="relative z-10">{time}</span>
                                )}

                                {/* mobile-only label below time */}
                                {isBooked && (
                                  <span className="mt-1 text-[11px] text-gray-400 block sm:hidden" aria-hidden="true">belegt</span>
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Right Column - Service & Contact Details */}
            {(() => {
              const { ref, inView } = useInView<HTMLDivElement>();
              return (
                <div 
                  ref={ref}
                  className="space-y-8 transition-all duration-700 delay-150"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : 'translateX(30px)'
                  }}
                >
                  <div>
                    <Label className="text-white mb-3 block text-lg">Behandlung auswählen</Label>
                    <div className="relative booking-select w-full">
                      <CustomSelect
                        options={services}
                        value={selectedService}
                        onChange={(v) => setSelectedService(v)}
                        placeholder="Wählen Sie eine Behandlung"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#FFD700]/30"></div>
                      <h3 className="text-white text-lg">Ihre Kontaktdaten</h3>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#FFD700]/30"></div>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <Label className="text-gray-300 mb-3 block flex items-center gap-2">
                          <User className="w-4 h-4 text-[#FFD700]" />
                          Name
                        </Label>
                        <Input
                          placeholder="Ihr vollständiger Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-zinc-950/50 border-white/10 text-white placeholder:text-gray-600 py-6 focus:border-[#FFD700] transition-colors"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-3 block flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#FFD700]" />
                          E-Mail
                        </Label>
                        <Input
                          type="email"
                          placeholder="ihre@email.de"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-zinc-950/50 border-white/10 text-white placeholder:text-gray-600 py-6 focus:border-[#FFD700] transition-colors"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-3 block flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#FFD700]" />
                          Telefon
                        </Label>
                        <Input
                          type="tel"
                          placeholder="+49 170 4781661"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-zinc-950/50 border-white/10 text-white placeholder:text-gray-600 py-6 focus:border-[#FFD700] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black py-8 text-lg border-0 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={!date || !selectedTime || !selectedService || !formData.name || !formData.email || !formData.phone || isBooking}
                  >
                    {isBooking ? "Wird gespeichert..." : "Jetzt buchen"}
                  </Button>
                  
                  <p className="text-center text-gray-400 text-sm mt-3">
                    Nur Barzahlung möglich
                  </p>

                  {isBooked && (
                    <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#D4AF37]/10 border border-[#FFD700]/50 rounded-xl p-6 animate-[fadeIn_0.5s_ease-in] shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-[#FFD700]" />
                        <p className="text-[#FFD700] text-lg font-semibold">Buchung erfolgreich!</p>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        Vielen Dank! Ihre Buchung wurde gespeichert. Wir freuen uns darauf, Sie zu verwöhnen!
                      </p>
                      {bookedDate && bookedTime && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-gray-400 text-sm">
                            Reservierung am <span className="text-white font-medium">{bookedDate.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}</span> um <span className="text-[#FFD700] font-medium">{bookedTime} Uhr</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {date && selectedTime && selectedService && (
                    <div className="bg-zinc-950/50 border border-[#FFD700]/30 rounded-xl p-6 animate-[fadeIn_0.5s_ease-in]">
                      <p className="text-gray-400 mb-2">Gewählter Termin:</p>
                      <p className="text-white text-lg mb-1">
                        {date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <p className="text-[#FFD700] text-2xl">{selectedTime} Uhr</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </Card>

        {/* Terminabsagen block removed as requested */}
      </div>
    </section>
  );
}