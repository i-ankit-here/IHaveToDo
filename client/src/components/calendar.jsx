import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar1Icon } from "lucide-react"

const Calendar = () => {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch("/api/events");
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);
    return (
        <div className="flex gap-1">
            {open && (
                <div className="flex flex-col w-2xs mx-2 gap-1 p-3 items-center rounded-md themed-bg">
                    <h2>Calendar</h2>

                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            )}
            <div className="flex flex-col h-1/2 mx-2 gap-1 p-3 items-center rounded-md themed-bg">
                <Button size="icon" className="cursor-pointer" onClick={() => setOpen(!open)}><Calendar1Icon /></Button>
            </div>
        </div>
    )
}

export default Calendar
