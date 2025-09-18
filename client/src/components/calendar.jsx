import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "./ui/separator"
import { Label } from "@/components/ui/label"
import { Calendar } from "./ui/calendar"
import { Calendar1Icon, ChevronLeft, ChevronRight } from "lucide-react"
import getEnvironment from "../../getEnvironment"
import { Skeleton } from "./ui/skeleton"

const Calendar1 = () => {
    const apiURL = getEnvironment();
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calView, setCalView] = useState(false);
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        const fetchEvents = async () => {
            selectedDate.setHours(0, 0, 0, 0);
            const endDate = new Date(selectedDate);
            endDate.setHours(23, 59, 59, 999);
            console.log("Fetching events from", new Date(selectedDate).toISOString(), "to", endDate.toISOString());
            try {
                const response = await fetch(`${apiURL}/api/v1/calendar/events`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        startDate: selectedDate.toISOString(),
                        endDate: endDate.toISOString()
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.data.events);
                    const userEvents = data.data.events.map(event => {
                        const eventDate = new Date(event.end.dateTime);
                        const eventTime = eventDate.getHours();
                        return { summary: event.summary, eventTime, id: event.id };
                    });
                    setEvents(userEvents);
                } else {
                    console.error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [open, selectedDate]);
    console.log("events: ", events);
    return (
        <div className="flex h-full gap-1">
            {open && (
                <div className="flex flex-col w-2xs ml-2 h-full gap-1 py-3 items-center rounded-md themed-bg">
                    <h2 className="text-xl pb-1 font-semibold">Calendar</h2>
                    <div className="flex gap-3 items-center">
                        <ChevronLeft
                            onClick={() => {
                                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
                            }}
                            className="cursor-pointer" />
                        <div
                            onClick={() => setCalView(!calView)}
                            className="themed-bg-secondary px-2 py-1 cursor-pointer rounded-sm"><h3>{selectedDate.toDateString()}</h3></div>
                        <ChevronRight
                            onClick={() => {
                                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
                            }}
                            className="cursor-pointer" />
                    </div>
                    {
                        calView && <Calendar mode="single" selected={selectedDate} onSelect={(e) => {
                            setSelectedDate(e);
                            setCalView(false);
                        }} className="rounded-md" />
                    }
                    {
                        loading ? <div className="flex flex-col gap-1 overflow-y-scroll py-2 w-full overflow-x-hidden">
                            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                <div key={hour} className="flex flex-col gap-1">
                                    <div className="flex gap-1 items-center"><Label>{hour}:00</Label><Separator /></div>
                                    <Skeleton className="h-5 ml-4 rounded-sm" />
                                </div>
                            ))}
                        </div> : <div className="flex flex-col gap-4 overflow-y-scroll py-2 w-full overflow-x-hidden">
                            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                <div key={hour} className="flex flex-col gap-1">
                                    <div className="flex gap-1 items-center"><Label>{hour}:00</Label><Separator /></div>
                                    {
                                        events.filter((event) => event.eventTime == hour).map((item) => (<div key={item.id}
                                            className="ml-4 px-1 themed-border themed-bg-secondary rounded-sm cursor-pointer">
                                            <p className="text-sm">{item.summary}</p>
                                        </div>))
                                    }
                                </div>
                            ))}
                        </div>
                    }
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            )}
            <div className="flex flex-col h-1/2 mr-2 gap-1 p-3 items-center rounded-md themed-bg">
                <Button size="icon" className="cursor-pointer" onClick={() => setOpen(!open)}><Calendar1Icon /></Button>
            </div>
        </div>
    )
}

export default Calendar1
