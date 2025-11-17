import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function CustomCalendar({ selected, onSelect, disabled }: CustomCalendarProps) {
  // Start with January 2026 by default
  const [currentMonth, setCurrentMonth] = useState(selected || new Date(2026, 0, 1));

  useEffect(() => {
    if (selected) setCurrentMonth(selected);
  }, [selected]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    // Create date at noon local time to avoid timezone issues
    const selectedDate = new Date(year, month, day, 12, 0, 0, 0);
    if (disabled && disabled(selectedDate)) {
      return;
    }
    onSelect?.(selectedDate);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };

  const isDisabled = (day: number) => {
    if (!disabled) return false;
    const date = new Date(year, month, day, 12, 0, 0, 0);
    return disabled(date);
  };

  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const days = [];
  
  // Empty cells for days before the first day of the month (adjusted for Monday start)
  const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelectedDay = isSelected(day);
    const isDisabledDay = isDisabled(day);
    const isToday = 
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={isDisabledDay}
        className={`
          h-10 w-10 rounded-lg transition-all duration-300
          ${isSelectedDay 
            ? "bg-gradient-to-br from-[#FFD700] to-[#D4AF37] text-black shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110" 
            : isToday
            ? "bg-zinc-800 text-[#FFD700] border border-[#FFD700]/30"
            : "text-gray-300 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border hover:border-[#FFD700]/30"
          }
          ${isDisabledDay ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={previousMonth}
          className="h-9 w-9 p-0 border-white/10 hover:bg-[#FFD700]/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-white tracking-wide">
          {monthNames[month]} {year}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-9 w-9 p-0 border-white/10 hover:bg-[#FFD700]/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-[#FFD700] text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}