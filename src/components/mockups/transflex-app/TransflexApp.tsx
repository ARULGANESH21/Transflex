import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Crosshair,
  Filter,
  Gauge,
  Home,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Plus,
  Route,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type View = "home" | "trip" | "bookings" | "assistant" | "profile";
type Station = {
  name: string;
  area: string;
  distance: string;
  speed: string;
  connector: string;
  slots: number;
  time: string;
  rating: string;
  availability: "Available" | "Busy" | "Limited";
  accent: string;
};

const stations: Station[] = [
  {
    name: "TRANSFLEX Charging Hub",
    area: "White Town · near Goubert Avenue",
    distance: "0.8 km",
    speed: "120 kW",
    connector: "CCS2 · Type 2",
    slots: 4,
    time: "28 min",
    rating: "4.9",
    availability: "Available",
    accent: "lime",
  },
  {
    name: "Heritage Town Charge",
    area: "Mission Street · Heritage Town",
    distance: "1.6 km",
    speed: "60 kW",
    connector: "CCS2",
    slots: 2,
    time: "42 min",
    rating: "4.7",
    availability: "Limited",
    accent: "aqua",
  },
  {
    name: "Lawspet Green Point",
    area: "Lawspet · near Airport Road",
    distance: "2.4 km",
    speed: "180 kW",
    connector: "CCS2 · CHAdeMO",
    slots: 6,
    time: "22 min",
    rating: "4.8",
    availability: "Available",
    accent: "lime",
  },
  {
    name: "Auroville Road Stop",
    area: "Auroville Road · Kuilapalayam",
    distance: "4.1 km",
    speed: "90 kW",
    connector: "CCS2 · Type 2",
    slots: 3,
    time: "34 min",
    rating: "4.6",
    availability: "Available",
    accent: "aqua",
  },
  {
    name: "Ariyankuppam Riverside",
    area: "Ariyankuppam · Cuddalore Road",
    distance: "4.8 km",
    speed: "60 kW",
    connector: "CCS2",
    slots: 1,
    time: "48 min",
    rating: "4.5",
    availability: "Busy",
    accent: "amber",
  },
  {
    name: "ECR Coastal Charge",
    area: "ECR · near Paradise Beach turn",
    distance: "5.2 km",
    speed: "150 kW",
    connector: "CCS2",
    slots: 4,
    time: "25 min",
    rating: "4.8",
    availability: "Available",
    accent: "lime",
  },
  {
    name: "White Town Courtyard",
    area: "Rue Suffren · White Town",
    distance: "1.1 km",
    speed: "30 kW",
    connector: "Type 2",
    slots: 2,
    time: "1 hr 12 min",
    rating: "4.4",
    availability: "Limited",
    accent: "aqua",
  },
];

const routeStops = [
  ["TRANSFLEX White Town", "Puducherry", "0 km", "120 kW", "4 slots", "28 min"],
  ["Lawspet Green Point", "Puducherry", "4 km", "180 kW", "6 slots", "22 min"],
  ["Marakkanam Highway Stop", "Marakkanam", "38 km", "120 kW", "3 slots", "30 min"],
  ["Kovalam Coast Charge", "Kovalam", "72 km", "150 kW", "4 slots", "25 min"],
  ["Mahabalipuram Bay Hub", "Mahabalipuram", "96 km", "180 kW", "5 slots", "22 min"],
  ["Kelambakkam Charge Point", "OMR · Kelambakkam", "119 km", "60 kW", "2 slots", "42 min"],
  ["Sholinganallur Fast Lane", "Chennai OMR", "142 km", "180 kW", "4 slots", "22 min"],
  ["Adyar River Charge", "Adyar · Chennai", "164 km", "120 kW", "3 slots", "28 min"],
  ["Guindy Central Hub", "Guindy · Chennai", "177 km", "150 kW", "5 slots", "25 min"],
];

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Find", icon: Home },
  { id: "trip", label: "Long drive", icon: Route },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "assistant", label: "Assistant", icon: Sparkles },
  { id: "profile", label: "Profile", icon: UserRound },
];

function StatusPill({ status }: { status: Station["availability"] }) {
  const colors = {
    Available: "bg-[#bbf36b]/10 text-[#c9ff7d] border-[#bbf36b]/20",
    Limited: "bg-[#f3c969]/10 text-[#f5d67d] border-[#f3c969]/20",
    Busy: "bg-[#ff8a7a]/10 text-[#ff9b8c] border-[#ff8a7a]/20",
  };
  return <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${colors[status]}`}>{status}</span>;
}

function MapPanel({ selected, onSelect }: { selected?: Station; onSelect: (station: Station) => void }) {
  const positions = [
    "left-[57%] top-[28%]",
    "left-[32%] top-[48%]",
    "left-[72%] top-[42%]",
    "left-[22%] top-[25%]",
    "left-[77%] top-[71%]",
    "left-[42%] top-[76%]",
    "left-[14%] top-[67%]",
  ];
  return (
    <div className="relative h-[235px] overflow-hidden rounded-[26px] border border-white/10 bg-[#102a35] shadow-2xl shadow-black/20" aria-label="Map showing nearby charging stations">
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(32deg, transparent 46%, rgba(126,206,205,.22) 47%, transparent 48%), linear-gradient(115deg, transparent 46%, rgba(126,206,205,.18) 47%, transparent 48%), linear-gradient(90deg, transparent 47%, rgba(126,206,205,.13) 48%, transparent 49%)", backgroundSize: "150px 125px, 210px 160px, 175px 120px" }} />
      <div className="absolute -left-6 top-12 h-36 w-[130%] rotate-[16deg] border-y border-[#9edbd0]/15 bg-[#174047]/60" />
      <div className="absolute left-[-12%] top-[62%] h-[2px] w-[130%] rotate-[-26deg] bg-[#c8e5c6]/20" />
      <div className="absolute left-[39%] top-[-18%] h-[150%] w-[2px] rotate-[20deg] bg-[#c8e5c6]/20" />
      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#0b1a23]/70 px-3 py-1.5 text-[10px] tracking-[.16em] text-[#9bc4c5]">PUDUCHERRY CITY</span>
      <span className="absolute bottom-4 left-4 text-[10px] text-[#8eb4b6]">White Town</span>
      <span className="absolute right-5 top-20 text-[10px] text-[#8eb4b6]">Lawspet</span>
      <span className="absolute bottom-5 right-5 text-[10px] text-[#8eb4b6]">Ariyankuppam</span>
      {stations.map((station, index) => (
        <button
          type="button"
          key={station.name}
          onClick={() => onSelect(station)}
          aria-label={`Select ${station.name}`}
          className={`absolute ${positions[index]} z-10 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#102a35] bg-[#c9ff7d] text-[#102a35] shadow-lg shadow-[#b9ef73]/30 transition-transform hover:scale-110 ${selected?.name === station.name ? "scale-125 ring-4 ring-[#c9ff7d]/20" : ""}`}
        >
          <Zap size={13} strokeWidth={3} />
        </button>
      ))}
      <div className="absolute left-[50%] top-[51%] z-20 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-3 animate-ping rounded-full bg-[#64dfda]/20" />
        <span className="relative grid h-7 w-7 place-items-center rounded-full border-4 border-[#d8f1e8] bg-[#3faea9] shadow-xl"><LocateFixed size={12} color="#e3fff3" /></span>
      </div>
      <button type="button" className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-[#091820]/80 text-[#b8e6dc]" aria-label="Recenter map"><Crosshair size={16} /></button>
    </div>
  );
}

function StationCard({ station, onBook, onDirections, compact = false }: { station: Station; onBook: (station: Station) => void; onDirections: (station: Station) => void; compact?: boolean }) {
  return (
    <article className={`group rounded-[24px] border border-white/10 bg-[#132b34]/90 p-4 transition-all hover:-translate-y-0.5 hover:border-[#b9ef73]/35 ${compact ? "min-w-[278px]" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${station.accent === "lime" ? "bg-[#c8ff7a]/12 text-[#c8ff7a]" : station.accent === "amber" ? "bg-[#f3c969]/12 text-[#f3d77b]" : "bg-[#6ad9d2]/12 text-[#79e1d9]"}`}><BatteryCharging size={19} /></div>
          <div>
            <h3 className="text-sm font-semibold leading-tight text-[#edf8ef]">{station.name}</h3>
            <p className="mt-1 text-[11px] text-[#8eb5b6]">{station.area}</p>
          </div>
        </div>
        <StatusPill status={station.availability} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/8 py-3 text-[11px]">
        <div><p className="text-[#759b9e]">Distance</p><p className="mt-1 font-semibold text-[#d9eee7]">{station.distance}</p></div>
        <div><p className="text-[#759b9e]">Speed</p><p className="mt-1 font-semibold text-[#c8ff7a]">{station.speed}</p></div>
        <div><p className="text-[#759b9e]">Slots</p><p className="mt-1 font-semibold text-[#d9eee7]">{station.slots} open</p></div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-3 text-[10px] text-[#9fc1c0]">
        <span className="flex items-center gap-1"><Zap size={12} className="text-[#c8ff7a]" /> {station.connector}</span>
        <span className="flex items-center gap-1"><Timer size={12} /> {station.time}</span>
        <span className="flex items-center gap-1"><Star size={12} className="fill-[#f2ca67] text-[#f2ca67]" /> {station.rating}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onBook(station)} className="flex-1 rounded-xl bg-[#c8ff7a] py-2.5 text-xs font-bold text-[#112329] transition-colors hover:bg-[#dbff9f]">Book now</button>
        <button type="button" onClick={() => onDirections(station)} aria-label={`Get directions to ${station.name}`} className="grid w-11 place-items-center rounded-xl border border-white/12 text-[#a8d3cd] transition-colors hover:bg-white/8"><Navigation size={15} /></button>
      </div>
    </article>
  );
}

function BookingSheet({ station, onClose, onConfirm }: { station: Station; onClose: () => void; onConfirm: (slot: string) => void }) {
  const [slot, setSlot] = useState("10:30 AM");
  const slots: [string, boolean][] = [
    ["10:00 AM", true],
    ["10:30 AM", true],
    ["11:00 AM", false],
    ["11:30 AM", true],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#061117]/80 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Book charging slot">
      <div className="w-full max-w-lg rounded-t-[30px] border border-white/10 bg-[#10262f] p-5 shadow-2xl sm:rounded-[30px]">
        <div className="mb-5 flex items-start justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c8ff7a]">Reserve your charge</p><h2 className="mt-1 text-xl font-semibold text-[#eff9f0]">{station.name}</h2><p className="mt-1 text-xs text-[#8eb5b6]">{station.area}</p></div>
          <button type="button" onClick={onClose} aria-label="Close booking dialog" className="rounded-full p-2 text-[#91b6b6] hover:bg-white/8"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#c8ff7a]/15 bg-[#c8ff7a]/6 p-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c8ff7a]/15 text-[#c8ff7a]"><CalendarDays size={18} /></div>
          <div><p className="text-xs font-semibold text-[#e4f2e8]">Today · Tuesday, 18 June</p><p className="mt-0.5 text-[11px] text-[#8eb5b6]">Puducherry local time · 4 connectors open</p></div>
        </div>
        <p className="mb-2 mt-5 text-xs font-semibold text-[#dcece7]">Choose a start time</p>
        <div className="grid grid-cols-2 gap-2">
          {slots.map(([time, open]) => (
            <button type="button" key={time} disabled={!open} onClick={() => setSlot(time)} className={`rounded-xl border py-3 text-sm transition-all ${!open ? "cursor-not-allowed border-white/5 bg-white/[.02] text-[#577578] line-through" : slot === time ? "border-[#c8ff7a] bg-[#c8ff7a] font-bold text-[#112329]" : "border-white/10 bg-[#17333c] text-[#c9e3dd] hover:border-[#c8ff7a]/50"}`}>{time}{!open && <span className="ml-1 text-[9px] no-underline">booked</span>}</button>
          ))}
        </div>
        <button type="button" onClick={() => onConfirm(slot)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8ff7a] py-3.5 text-sm font-bold text-[#102329] hover:bg-[#dcffa0]"><ShieldCheck size={17} /> Confirm slot · {slot}</button>
      </div>
    </div>
  );
}

export function TransflexApp() {
  const [view, setView] = useState<View>("home");
  const [selected, setSelected] = useState<Station>(stations[0]);
  const [bookingStation, setBookingStation] = useState<Station | null>(null);
  const [confirmed, setConfirmed] = useState<{ station: Station; slot: string; id: string } | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "fast" | "open">("all");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [assistantReply, setAssistantReply] = useState("I can compare nearby chargers, find the fastest stop, or help you reserve a slot.");
  const [vehicle, setVehicle] = useState("Tata Nexon EV");
  const [tripSelected, setTripSelected] = useState(routeStops[2][0]);
  const [directions, setDirections] = useState<Station | null>(null);
  const [startDestination, setStartDestination] = useState("Puducherry");
  const [endDestination, setEndDestination] = useState("Chennai");
  const [routeEditorOpen, setRouteEditorOpen] = useState(false);
  const [routeEstimate, setRouteEstimate] = useState({ distance: "177 km", duration: "3 hr 45 min" });
  const [routeStatus, setRouteStatus] = useState("Simulated route estimate");

  const filteredStations = useMemo(() => stations.filter((station) => {
    const matches = `${station.name} ${station.area}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === "all" || (filter === "fast" ? Number.parseInt(station.speed) >= 120 : station.slots > 0);
    return matches && filterMatch;
  }), [search, filter]);

  const openBooking = (station: Station) => { setSelected(station); setBookingStation(station); };
  const confirmBooking = (slot: string) => {
    if (bookingStation) setConfirmed({ station: bookingStation, slot, id: `TFX-${Math.floor(100000 + Math.random() * 899999)}` });
    setBookingStation(null);
    setView("bookings");
  };
  const askAssistant = (prompt: string) => {
    setAssistantText(prompt);
    const response = prompt.toLowerCase().includes("fast") ? "Lawspet Green Point is the quickest nearby option at 180 kW, with 6 slots open right now." : prompt.toLowerCase().includes("compare") ? "For your Nexon EV, White Town is the calmest stop; Lawspet is faster, while ECR Coastal Charge is best if you are heading south." : prompt.toLowerCase().includes("book") ? "I found 4 open slots at White Town. The next comfortable window is 10:30 AM." : prompt.toLowerCase().includes("trip") ? "For Puducherry to Chennai, I would make one stop at Mahabalipuram Bay Hub around the halfway mark." : "TRANSFLEX Charging Hub – White Town is 0.8 km away, with 120 kW charging, 4 open slots, and an estimated 28 minute charge.";
    setAssistantReply(response);
  };
  const goDirections = (station: Station) => setDirections(station);
  const updateRouteEstimate = () => {
    const nextStart = startDestination.trim() || "Puducherry";
    const nextEnd = endDestination.trim() || "Chennai";
    setStartDestination(nextStart);
    setEndDestination(nextEnd);
    const isDefaultRoute = nextStart.toLowerCase() === "puducherry" && nextEnd.toLowerCase() === "chennai";
    setRouteEstimate(isDefaultRoute ? { distance: "177 km", duration: "3 hr 45 min" } : { distance: "198 km", duration: "4 hr 15 min" });
    setRouteStatus("Updated just now · simulated route estimate");
    setRouteEditorOpen(false);
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#08161e] text-[#e5f3eb] selection:bg-[#c8ff7a] selection:text-[#102329]" style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @keyframes transflex-rise { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes transflex-fade { from { opacity:0 } to { opacity:1 } }
        .tf-rise { animation: transflex-rise .45s ease-out both; }
        .tf-delay-1 { animation-delay: .07s; } .tf-delay-2 { animation-delay: .14s; } .tf-delay-3 { animation-delay: .21s; }
        .tf-no-scrollbar::-webkit-scrollbar { display:none; } .tf-no-scrollbar { scrollbar-width:none; }
      `}</style>
      <div className="mx-auto min-h-[100dvh] w-full max-w-[1180px] px-4 pb-28 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between py-5">
          <button type="button" onClick={() => setView("home")} className="flex items-center gap-2.5" aria-label="TRANSFLEX home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c8ff7a] text-[#102329] shadow-lg shadow-[#c8ff7a]/10"><Zap size={19} strokeWidth={2.8} /></span>
            <span className="text-[17px] font-black tracking-[-.04em] text-[#edfaef]">TRANS<span className="text-[#c8ff7a]">FLEX</span></span>
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-[#64d7cf]/15 bg-[#12303a]/70 px-3 py-2 text-[10px] text-[#a2d0ca] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#c8ff7a] shadow-[0_0_10px_#c8ff7a]" /> GPS live · Puducherry</div>
          <button type="button" onClick={() => setView("profile")} aria-label="Open profile" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#112831] text-[#aed1cb] hover:bg-[#173640]"><UserRound size={17} /></button>
        </header>

        {view === "home" && (
          <main className="tf-rise">
            <section className="pt-5 sm:pt-10">
              <div className="flex items-end justify-between gap-3">
                <div><p className="text-xs font-medium text-[#84aaa9]">Good morning, Arjun</p><h1 className="mt-1 max-w-[610px] text-[32px] font-semibold leading-[1.06] tracking-[-.05em] text-[#eff9f0] sm:text-5xl">Charge with a little more <span className="text-[#c8ff7a]">certainty.</span></h1></div>
                <div className="hidden text-right sm:block"><p className="text-[10px] uppercase tracking-[.2em] text-[#6f9698]">Vehicle</p><p className="mt-1 text-sm font-semibold text-[#dceee7]">{vehicle}</p></div>
              </div>
              <div className="mt-7 flex items-center gap-2 text-xs text-[#9fc5c1]"><MapPin size={14} className="text-[#c8ff7a]" /> Near Puducherry City <span className="mx-1 text-[#54787b]">·</span><span className="text-[#c8ff7a]">7 stations within 5 km</span></div>
            </section>
            <section className="mt-6">
              <MapPanel selected={selected} onSelect={setSelected} />
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#71999a]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#4ec8c0]" /> Your location</span><span className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#c8ff7a] text-[#102329]"><Zap size={9} /></span> Charging station</span><button type="button" className="flex items-center gap-1 text-[#b8dcd1] hover:text-[#c8ff7a]" onClick={() => setDirections(selected)}><Compass size={13} /> Explore map</button></div>
            </section>
            <section className="mt-8">
              <div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Nearby, right now</p><h2 className="mt-1 text-xl font-semibold tracking-[-.03em] text-[#e9f5ec]">Find your next stop</h2></div><span className="text-xs text-[#88acad]">{filteredStations.length} results</span></div>
              <div className="mt-4 flex gap-2">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#102831] px-3 text-[#88abad]"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search area or station" className="min-w-0 flex-1 bg-transparent py-3 text-xs text-[#e8f5ed] outline-none placeholder:text-[#648486]" aria-label="Search stations" /></label>
                <button type="button" onClick={() => setFilter(filter === "all" ? "fast" : filter === "fast" ? "open" : "all")} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#102831] px-3 text-xs text-[#b8d7d0] hover:border-[#c8ff7a]/40"><Filter size={14} /> <span className="hidden sm:inline">{filter === "all" ? "Filters" : filter === "fast" ? "Fast" : "Open now"}</span></button>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {filteredStations.map((station, index) => <div key={station.name} className={`tf-rise tf-delay-${Math.min(index + 1, 3)}`}><StationCard station={station} onBook={openBooking} onDirections={goDirections} /></div>)}
                {filteredStations.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-10 text-center"><Search className="mx-auto text-[#719899]" /><p className="mt-3 text-sm text-[#d8ebe4]">No stations match that search.</p><button type="button" onClick={() => { setSearch(""); setFilter("all"); }} className="mt-3 text-xs font-semibold text-[#c8ff7a]">Clear search</button></div>}
              </div>
            </section>
          </main>
        )}

        {view === "trip" && (
          <main className="tf-rise pt-5 sm:pt-10">
            <button type="button" onClick={() => setView("home")} className="mb-5 flex items-center gap-2 text-xs text-[#9bc1bd] hover:text-[#c8ff7a]"><ArrowLeft size={15} /> Back to nearby chargers</button>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Long drive</p><h1 className="mt-2 break-words text-4xl font-semibold tracking-[-.06em] text-[#eff9f0]">{startDestination} <span className="font-normal text-[#6f9698]">to</span> {endDestination}</h1><p className="mt-2 text-sm text-[#8eb5b6]">A calmer route, with the right charge waiting when you arrive.</p></div><div className="rounded-2xl border border-[#c8ff7a]/15 bg-[#c8ff7a]/6 px-4 py-3"><div className="flex items-center justify-between gap-5"><p className="text-[10px] uppercase tracking-[.16em] text-[#82a8a7]">Route estimate</p><button type="button" onClick={() => setRouteEditorOpen((open) => !open)} className="flex items-center gap-1 text-[10px] font-semibold text-[#c8ff7a] hover:text-[#e1ffad]">{routeEditorOpen ? "Close" : "Edit route"} <Settings2 size={12} /></button></div><p className="mt-1 text-lg font-semibold text-[#dff3e8]">{routeEstimate.distance} <span className="text-sm font-normal text-[#8eb5b6]">· {routeEstimate.duration}</span></p><p className="mt-1 text-[10px] text-[#6f9698]">{routeStatus}</p></div></div>
            {routeEditorOpen && <section className="mt-5 rounded-[24px] border border-[#c8ff7a]/20 bg-[#102831] p-4 sm:p-5"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#c8ff7a]/12 text-[#c8ff7a]"><Route size={18} /></div><div><p className="text-sm font-semibold text-[#edf8ee]">Plan a different route</p><p className="mt-1 text-xs leading-5 text-[#8eb5b6]">Change your start and end destinations to refresh the demo estimate and route preview.</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.16em] text-[#6f9698]">Start destination</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b2028] px-3"><MapPin size={15} className="shrink-0 text-[#c8ff7a]" /><input value={startDestination} onChange={(event) => setStartDestination(event.target.value)} placeholder="e.g. Puducherry" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#e8f5ed] outline-none placeholder:text-[#648486]" aria-label="Start destination" /></div></label><label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.16em] text-[#6f9698]">End destination</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b2028] px-3"><Navigation size={15} className="shrink-0 text-[#6ad9d2]" /><input value={endDestination} onChange={(event) => setEndDestination(event.target.value)} placeholder="e.g. Chennai" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#e8f5ed] outline-none placeholder:text-[#648486]" aria-label="End destination" /></div></label></div><button type="button" onClick={updateRouteEstimate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8ff7a] py-3 text-xs font-bold text-[#102329] hover:bg-[#dcffa0]">Update route estimate <ArrowRight size={14} /></button></section>}
            <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#102a35] p-5">
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(24deg, transparent 48%, rgba(126,206,205,.24) 49%, transparent 50%), linear-gradient(110deg, transparent 48%, rgba(126,206,205,.18) 49%, transparent 50%)", backgroundSize: "120px 120px, 180px 150px" }} />
                <div className="relative flex h-[310px] flex-col justify-between">
                  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#c8ff7a] text-[#102329]"><MapPin size={17} /></div><div><p className="max-w-[220px] truncate text-sm font-semibold text-[#eaf8ec]">{startDestination}</p><p className="text-[10px] text-[#83a9a8]">Start · 08:30 AM</p></div></div>
                  <div className="absolute bottom-10 left-6 top-12 w-[3px] rounded-full bg-gradient-to-b from-[#c8ff7a] via-[#6ad9d2] to-[#c8ff7a]" />
                  <div className="ml-14 rounded-2xl border border-white/10 bg-[#0c202a]/85 p-3"><p className="text-[10px] uppercase tracking-[.15em] text-[#6f9698]">Recommended stop</p><p className="mt-1 text-sm font-semibold text-[#e9f6eb]">Mahabalipuram Bay Hub</p><p className="mt-1 text-[11px] text-[#91b5b2]">96 km · about 2 hours in</p></div>
                  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full border border-[#6ad9d2] bg-[#18454a] text-[#a7ede4]"><Navigation size={17} /></div><div><p className="max-w-[220px] truncate text-sm font-semibold text-[#eaf8ec]">{endDestination}</p><p className="text-[10px] text-[#83a9a8]">Arrival · around 12:15 PM</p></div></div>
                  <span className="absolute bottom-4 right-3 text-[10px] text-[#6f9698]">Simulated route preview</span>
                </div>
              </div>
              <div className="rounded-[28px] border border-[#c8ff7a]/15 bg-[#112c31] p-5"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#c8ff7a]/12 text-[#c8ff7a]"><Sparkles size={19} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c8ff7a]">AI recommended charging stops</p><h2 className="mt-1 text-lg font-semibold text-[#edf8ee]">One easy pause is enough.</h2><p className="mt-2 text-xs leading-5 text-[#9fc2bc]">Based on your {vehicle}, route timing and charger availability, Mahabalipuram Bay Hub gives you the best balance of speed and a comfortable halfway break.</p></div></div><button type="button" onClick={() => setTripSelected(routeStops[4][0])} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[#c8ff7a]/35 bg-[#c8ff7a]/8 p-3 text-left hover:bg-[#c8ff7a]/15"><span><span className="block text-sm font-semibold text-[#e7f6ea]">Mahabalipuram Bay Hub</span><span className="mt-1 block text-[11px] text-[#a1c6bf]">96 km · 180 kW · 5 slots open</span></span><ArrowRight size={17} className="text-[#c8ff7a]" /></button></div>
            </div>
            <div className="mt-9 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Along your route</p><h2 className="mt-1 text-xl font-semibold text-[#e9f5ec]">Choose a charging stop</h2></div><span className="text-xs text-[#88acad]">{routeStops.length} stations</span></div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">{routeStops.map((stop, index) => <article key={stop[0]} className={`rounded-[22px] border p-4 transition-colors ${tripSelected === stop[0] ? "border-[#c8ff7a]/50 bg-[#16363a]" : "border-white/10 bg-[#132b34]/80"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#22484a] text-[10px] font-bold text-[#c8ff7a]">{index + 1}</span><h3 className="text-sm font-semibold text-[#eaf7ec]">{stop[0]}</h3></div><p className="mt-2 pl-8 text-[11px] text-[#86abad]">{stop[1]} · {stop[2]}</p></div>{index === 4 && <span className="rounded-full bg-[#c8ff7a]/12 px-2 py-1 text-[9px] font-bold text-[#c8ff7a]">AI PICK</span>}</div><div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/8 py-3 text-[11px]"><span><b className="block text-[#c8ff7a]">{stop[3]}</b><small className="text-[#759b9e]">charging</small></span><span><b className="block text-[#d9eee7]">{stop[4]}</b><small className="text-[#759b9e]">available</small></span><span><b className="block text-[#d9eee7]">{stop[5]}</b><small className="text-[#759b9e]">est. time</small></span></div><button type="button" onClick={() => { setTripSelected(stop[0]); if (index === 0) openBooking(stations[0]); else if (index === 4) openBooking(stations[3]); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c8ff7a]/35 py-2.5 text-xs font-bold text-[#c8ff7a] hover:bg-[#c8ff7a]/10">Book slot <ArrowRight size={14} /></button></article>)}</div>
          </main>
        )}

        {view === "bookings" && (
          <main className="tf-rise pt-6 sm:pt-10"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Your plans</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.06em] text-[#eff9f0]">My bookings</h1><p className="mt-2 text-sm text-[#8eb5b6]">Everything you need for a no-surprises charge.</p>
            {confirmed ? <section className="mt-7 overflow-hidden rounded-[28px] border border-[#c8ff7a]/25 bg-[#112d32]"><div className="flex items-center gap-3 border-b border-white/10 p-5"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#c8ff7a] text-[#102329]"><Check size={22} strokeWidth={3} /></div><div><p className="text-sm font-semibold text-[#eaf7ec]">Booking confirmed</p><p className="mt-0.5 text-[11px] text-[#9fc4bd]">Your connector is held for you.</p></div><span className="ml-auto rounded-full bg-[#c8ff7a]/10 px-2 py-1 text-[10px] font-bold text-[#c8ff7a]">UPCOMING</span></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#6f9698]">Tuesday, 18 June</p><h2 className="mt-2 text-xl font-semibold text-[#eff8f0]">{confirmed.station.name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-[#8eb5b6]"><MapPin size={13} /> {confirmed.station.area}</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-[#0b2028] p-3"><Clock3 size={14} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e4f3e8]">{confirmed.slot}</p><p className="text-[10px] text-[#71999a]">arrival window</p></div><div className="rounded-2xl bg-[#0b2028] p-3"><Zap size={14} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e4f3e8]">{confirmed.station.speed}</p><p className="text-[10px] text-[#71999a]">charging speed</p></div><div className="rounded-2xl bg-[#0b2028] p-3"><Timer size={14} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e4f3e8]">{confirmed.station.time}</p><p className="text-[10px] text-[#71999a]">estimated time</p></div><div className="rounded-2xl bg-[#0b2028] p-3"><ShieldCheck size={14} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e4f3e8]">{confirmed.id}</p><p className="text-[10px] text-[#71999a]">booking ID</p></div></div><button type="button" onClick={() => setDirections(confirmed.station)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8ff7a] py-3 text-xs font-bold text-[#102329] hover:bg-[#dcffa0]"><Navigation size={15} /> Get directions</button></div></section> : <section className="mt-7 rounded-[28px] border border-dashed border-white/15 bg-[#0d222b] p-10 text-center"><CalendarDays className="mx-auto text-[#73999b]" size={30} /><h2 className="mt-4 text-lg font-semibold text-[#e4f2e8]">Nothing booked yet</h2><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-[#83a7a8]">Pick a station near you and we will keep the details ready for the drive.</p><button type="button" onClick={() => setView("home")} className="mt-5 rounded-xl bg-[#c8ff7a] px-5 py-3 text-xs font-bold text-[#102329]">Find a charger</button></section>}
            <section className="mt-8"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Good to know</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/8 bg-[#102831] p-4"><ShieldCheck size={16} className="text-[#6ad9d2]" /><p className="mt-3 text-sm font-semibold">Your slot is protected</p><p className="mt-1 text-xs leading-5 text-[#84a8a8]">Arrive within 15 minutes of your window and your connector will be ready.</p></div><div className="rounded-2xl border border-white/8 bg-[#102831] p-4"><CircleHelp size={16} className="text-[#c8ff7a]" /><p className="mt-3 text-sm font-semibold">Need to change plans?</p><p className="mt-1 text-xs leading-5 text-[#84a8a8]">Ask Smart Assistant to help you find another nearby slot.</p></div></div></section>
          </main>
        )}

        {view === "assistant" && (
          <main className="tf-rise pt-6 sm:pt-10"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c8ff7a] text-[#102329]"><Sparkles size={23} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#c8ff7a]">TRANSFLEX intelligence</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.05em] text-[#eff9f0]">Smart Assistant</h1></div></div><p className="mt-4 max-w-lg text-sm leading-6 text-[#9ac0bb]">A second set of eyes for your drive. Ask naturally, and I will turn the local charging network into a simple next step.</p>
            <div className="mt-7 rounded-[28px] border border-white/10 bg-[#102831] p-4 sm:p-5"><div className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#c8ff7a]/12 text-[#c8ff7a]"><Sparkles size={16} /></div><div><p className="text-[10px] uppercase tracking-[.16em] text-[#6f9698]">TRANSFLEX suggests</p><p className="mt-2 text-sm leading-6 text-[#dceee6]">{assistantReply}</p></div></div>{assistantText && <p className="mt-4 ml-12 border-l-2 border-[#c8ff7a]/30 pl-3 text-[11px] text-[#7eaaa9]">“{assistantText}”</p>}<div className="mt-5 grid gap-2 sm:grid-cols-2">{["Find chargers near me", "Compare nearby stations", "Find the fastest charger", "Help me book a slot", "Plan my Puducherry to Chennai trip", "Suggest the best station"].map((prompt) => <button type="button" key={prompt} onClick={() => askAssistant(prompt)} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#16333b] px-3 py-3 text-left text-xs text-[#c9e3da] hover:border-[#c8ff7a]/40 hover:text-[#c8ff7a]"><span>{prompt}</span><ArrowRight size={14} /></button>)}</div><div className="mt-5 flex gap-2"><input value={assistantText} onChange={(event) => setAssistantText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && assistantText.trim()) askAssistant(assistantText); }} placeholder="Ask about your next charge..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b2028] px-3 py-3 text-xs text-[#e5f4eb] outline-none placeholder:text-[#648486] focus:border-[#c8ff7a]/40" aria-label="Ask Smart Assistant" /><button type="button" onClick={() => assistantText.trim() && askAssistant(assistantText)} aria-label="Send assistant message" className="grid w-11 place-items-center rounded-xl bg-[#c8ff7a] text-[#102329]"><Send size={15} /></button></div></div>
            <div className="mt-6 rounded-[24px] border border-[#c8ff7a]/20 bg-[#122d32] p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c8ff7a]">Recommended for you</p><h2 className="mt-1 text-lg font-semibold text-[#e9f7ec]">TRANSFLEX Charging Hub – White Town</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c8ff7a]/12 text-[#c8ff7a]"><Star size={18} className="fill-current" /></span></div><div className="mt-4 grid grid-cols-3 gap-3 border-y border-white/10 py-3 text-[11px]"><span><b className="block text-[#e5f4e9]">0.8 km</b><small className="text-[#78a09f]">from you</small></span><span><b className="block text-[#c8ff7a]">120 kW</b><small className="text-[#78a09f]">fast charge</small></span><span><b className="block text-[#e5f4e9]">4 slots</b><small className="text-[#78a09f]">available now</small></span></div><div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs text-[#9bc2bb]"><Timer size={14} /> 28 min estimated</span><button type="button" onClick={() => openBooking(stations[0])} className="rounded-xl bg-[#c8ff7a] px-4 py-2.5 text-xs font-bold text-[#102329]">Book this station</button></div></div>
          </main>
        )}

        {view === "profile" && (
          <main className="tf-rise pt-6 sm:pt-10"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#6f9698]">Your setup</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.06em] text-[#eff9f0]">Vehicle profile</h1><p className="mt-2 text-sm text-[#8eb5b6]">A little context helps TRANSFLEX make better calls.</p>
            <section className="mt-7 rounded-[28px] border border-[#c8ff7a]/20 bg-[#112c32] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c8ff7a]">Selected vehicle</p><h2 className="mt-2 text-2xl font-semibold text-[#ecf8ef]">{vehicle}</h2><p className="mt-1 text-xs text-[#8fb4b1]">Personal recommendations are on</p></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c8ff7a]/12 text-[#c8ff7a]"><BatteryCharging size={23} /></div></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#0b2028] p-3"><Gauge size={15} className="text-[#6ad9d2]" /><p className="mt-2 text-sm font-semibold text-[#e7f4e9]">{vehicle === "Hyundai Ioniq 5" ? "72.6 kWh" : vehicle === "MG ZS EV" ? "50.3 kWh" : "40.5 kWh"}</p><p className="text-[10px] text-[#71999a]">battery size</p></div><div className="rounded-2xl bg-[#0b2028] p-3"><Zap size={15} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e7f4e9]">CCS2</p><p className="text-[10px] text-[#71999a]">primary connector</p></div><div className="col-span-2 rounded-2xl bg-[#0b2028] p-3 sm:col-span-1"><Timer size={15} className="text-[#c8ff7a]" /><p className="mt-2 text-sm font-semibold text-[#e7f4e9]">20–80%</p><p className="text-[10px] text-[#71999a]">usual charge goal</p></div></div></section>
            <section className="mt-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#6f9698]">Choose your EV</p><h2 className="mt-1 text-lg font-semibold text-[#eaf6eb]">What are you driving?</h2></div><Settings2 size={17} className="text-[#70989a]" /></div><div className="mt-3 space-y-2">{["Tata Nexon EV", "MG ZS EV", "Hyundai Ioniq 5"].map((option) => <button type="button" key={option} onClick={() => setVehicle(option)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${vehicle === option ? "border-[#c8ff7a]/50 bg-[#16353a]" : "border-white/10 bg-[#102831] hover:border-white/20"}`}><span className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${vehicle === option ? "bg-[#c8ff7a] text-[#102329]" : "bg-[#1c3a40] text-[#94bdb7]"}`}><BatteryCharging size={17} /></span><span><span className="block text-sm font-semibold text-[#e8f5e9]">{option}</span><span className="mt-0.5 block text-[10px] text-[#7ea3a3]">{option === "Tata Nexon EV" ? "40.5 kWh · CCS2" : option === "MG ZS EV" ? "50.3 kWh · CCS2" : "72.6 kWh · CCS2"}</span></span></span>{vehicle === option && <Check size={17} className="text-[#c8ff7a]" />}</button>)}</div></section>
            <button type="button" onClick={() => setView("home")} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8ff7a] py-3.5 text-sm font-bold text-[#102329] hover:bg-[#dcffa0]">Save vehicle profile <Check size={16} /></button>
          </main>
        )}
      </div>

      {view !== "assistant" && <button type="button" onClick={() => setAssistantOpen(true)} aria-label="Open Smart Assistant" className="fixed bottom-[86px] right-4 z-30 flex items-center gap-2 rounded-full border border-[#c8ff7a]/30 bg-[#17353a] px-4 py-3 text-xs font-bold text-[#d9f6dd] shadow-xl shadow-black/20 transition-transform hover:scale-105 sm:bottom-7 sm:right-7"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#c8ff7a] text-[#102329]"><MessageCircle size={13} /></span> Smart Assistant</button>}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0b1b23]/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-[min(680px,calc(100%-32px))] sm:-translate-x-1/2 sm:bottom-4 sm:rounded-2xl sm:border" aria-label="Primary navigation"><div className="mx-auto flex max-w-xl justify-around">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setView(id)} className={`flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] transition-colors ${view === id ? "bg-[#c8ff7a]/10 font-bold text-[#c8ff7a]" : "text-[#779a9b] hover:text-[#b5d5cd]"}`}><Icon size={17} /><span>{label}</span></button>)}</div></nav>
      {assistantOpen && <div className="fixed inset-0 z-50 bg-[#061117]/65 backdrop-blur-sm" onClick={() => setAssistantOpen(false)}><div className="absolute bottom-0 right-0 w-full max-w-md rounded-t-[30px] border border-white/10 bg-[#102831] p-5 shadow-2xl sm:bottom-5 sm:right-5 sm:rounded-[28px]" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div className="flex gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#c8ff7a] text-[#102329]"><Sparkles size={19} /></div><div><p className="text-sm font-semibold text-[#ebf7ed]">Smart Assistant</p><p className="mt-1 text-[11px] text-[#84aaa8]">Here when the road gets interesting.</p></div></div><button type="button" onClick={() => setAssistantOpen(false)} aria-label="Close Smart Assistant" className="text-[#8aacac]"><X size={18} /></button></div><p className="mt-5 text-sm leading-6 text-[#c5dfd7]">{assistantReply}</p><div className="mt-5 grid gap-2">{["Find the best station for me", "Find fast chargers", "Help me book a charging slot", "Plan a long-distance trip"].map((prompt) => <button type="button" key={prompt} onClick={() => { askAssistant(prompt); setAssistantOpen(false); if (prompt.includes("trip")) setView("trip"); }} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#17343c] px-3 py-3 text-left text-xs text-[#cfe6de] hover:border-[#c8ff7a]/40">{prompt}<ArrowRight size={14} className="text-[#c8ff7a]" /></button>)}</div></div></div>}
      {bookingStation && <BookingSheet station={bookingStation} onClose={() => setBookingStation(null)} onConfirm={confirmBooking} />}
      {directions && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#061117]/70 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#102831] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c8ff7a]">Directions ready</p><h2 className="mt-2 text-lg font-semibold text-[#eff8f0]">{directions.name}</h2><p className="mt-1 text-xs text-[#8eb5b6]">{directions.area}</p></div><button type="button" onClick={() => setDirections(null)} aria-label="Close directions" className="text-[#8aacac]"><X size={18} /></button></div><div className="my-5 rounded-2xl bg-[#0b2028] p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#c8ff7a] text-[#102329]"><Navigation size={16} /></div><div><p className="text-sm font-semibold text-[#e6f4e9]">{directions.distance} away</p><p className="text-[11px] text-[#83a8a8]">Via Lal Bahadur Shastri Street · about 6 min</p></div></div></div><button type="button" onClick={() => setDirections(null)} className="w-full rounded-2xl bg-[#c8ff7a] py-3 text-xs font-bold text-[#102329]">Got it</button></div></div>}
    </div>
  );
}

export default TransflexApp;