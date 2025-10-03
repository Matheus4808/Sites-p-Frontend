import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CalendarEvent {
  id: number;
  type: "scrim" | "tournament";
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
}

const CalendarAdvanced: React.FC = () => {
  const navigate = useNavigate();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Mock de eventos
  const events: CalendarEvent[] = [
    { id: 1, type: "scrim", name: "Scrim Premiada", date: "2025-10-03", time: "19:00", description: "Treino competitivo com premiação simbólica" },
    { id: 2, type: "tournament", name: "Campeonato Amador", date: "2025-10-10", time: "15:00", description: "Torneio aberto à comunidade com 1000 coins de premiação" },
    { id: 3, type: "scrim", name: "Scrim VIP", date: "2025-10-15", time: "22:00", description: "Treino exclusivo para times selecionados" },
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleString("pt-BR", { month: "long" });

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="p-4">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">◀</button>
        <h1 className="text-2xl font-bold">{monthName} {currentYear}</h1>
        <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">▶</button>
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].map(d => (
          <div key={d} className="font-semibold">{d}</div>
        ))}

        {calendarCells.map((day, idx) => {
          if (!day) return <div key={idx} className="h-24 border p-1"></div>;

          const dayEvents = getEventsForDay(day);
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

          return (
            <div
              key={idx}
              className={`border p-2 min-h-[6rem] flex flex-col gap-1 rounded relative ${isToday ? "bg-blue-800" : "bg-gray-900"}`}
            >
              <span className="font-semibold">{day}</span>

              {dayEvents.map(event => (
                <div key={event.id} className="relative group">
                  <button
                    onClick={() => navigate(event.type === "scrim" ? `/scrims/${event.id}` : `/tournaments/${event.id}`)}
                    className={`text-xs p-1 rounded truncate w-full ${
                      event.type === "scrim"
                        ? "bg-purple-600 text-white"
                        : "bg-yellow-500 text-gray-900"
                    } hover:opacity-80`}
                  >
                    {event.name} ({event.time})
                  </button>

                  {/* Hover card com resumo do evento */}
                  <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-1 w-56 p-2 rounded bg-gray-800 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="font-semibold">{event.name}</p>
                    <p className="truncate">{event.description}</p>
                    <p className="text-gray-400">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarAdvanced;
