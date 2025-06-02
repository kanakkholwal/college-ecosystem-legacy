"use server"

import type { rawEventsSchemaType } from "~/constants/events"
import { rawEventsSchema } from "~/constants/events"
import dbConnect from "~/lib/dbConnect"
import {EventModel} from "~/models/events"

export async function createNewEvent(newEvent:rawEventsSchemaType){
    try{
        const validatedEvent = rawEventsSchema.safeParse(newEvent)
        if(!validatedEvent.success) {
            return Promise.reject(validatedEvent.error.errors[0].message)
        }
        await dbConnect()
        const event = new EventModel(newEvent)
        await event.save()
        return Promise.resolve(JSON.parse(JSON.stringify(event)))
    }catch(err){
        console.log(err)
        return Promise.reject(err instanceof Error ? err.message : "Something went wrong")
    }
}