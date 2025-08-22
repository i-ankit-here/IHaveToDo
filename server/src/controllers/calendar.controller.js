import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { google } from "googleapis";
import { apiError } from "../utils/apiError.js";

const getEvents = asyncHandler(async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    console.log("calendar", calendar);
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = response.data.items;
    res.status(200).json(new apiResponse(200, {
        events
    }));
});

const setEvent = asyncHandler(async (req, res) => {
    const { summary, description, startDateTime, endDateTime, attendees } = req.body;
    console.log(req.body);
    console.log("Event Details:", { summary, description, startDateTime, endDateTime });

    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    const event = {
        summary: summary,
        description: description,
        start: {
            dateTime: startDateTime, // e.g., '2025-08-28T09:00:00-07:00'
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Kolkata',
        },
        attendees: attendees,
    };

    try {
        const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            sendNotifications: true,
        });

        return createdEvent.data;
    } catch (error) {
        console.error('Error creating event', error);
        res.status(500).send('Error creating event');
    }
});


const updateEvent = asyncHandler(async (req, res) => {
    const { summary, description, startDateTime, endDateTime, eventId, attendees } = req.body;
    console.log("Update Event Details:", { summary, description, startDateTime, endDateTime, eventId, attendees });
    const event = {
        summary: summary,
        description: description,
        start: {
            dateTime: startDateTime, // e.g., '2025-08-28T09:00:00-07:00'
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Kolkata',
        },
        attendees: attendees,
    };

    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });

    const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendNotifications: true,
    });

    return response.data;
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        return false;
    }

    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendNotifications: true,
    });
    console.log("Event deleted successfully:", eventId);
    return true;
});

export { getEvents, setEvent, deleteEvent, updateEvent };