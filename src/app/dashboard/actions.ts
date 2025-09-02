'use server'

import { NewCue, Session } from "@/lib/model";
import { convertToSeconds } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

export async function createSession(sessionTitle: string, cues: NewCue[], duration: string) {
  try {
    const supabase = await createClient()

    const {data: sessionsData, error: sessionsError} = await supabase
      .from('sessions')
      .insert([{ title: sessionTitle, total_duration: duration }])
      .select('*')

    if (sessionsError) {
      return { success: false, message: `Failed to insert session: ${sessionsError.message}` };
    }

    if (!sessionsData) {
      return { success: false, message: 'Session not created' };
    } 

    const session = sessionsData as Session[];

    const {data: cuesData, error: cueError} = await supabase
      .from('cues')
      .insert(
        cues.map(cue => ({
          session_id: session[0].id,
          title: cue.title,
          speaker: cue.speaker,
          order: cue.order,
          duration: convertToSeconds(cue.duration),
          remaining_time: convertToSeconds(cue.duration)
        }))
      ).select('*')

    console.log(cuesData);

    if (cueError) {
      return { success: false, message: `Failed to insert cues: ${cueError.message}` };
    }

    revalidatePath('/dashboard');
    return { status: 'success', sessionId: session[0].id };
  } catch (error: any) {
    return { status: 'error', message: `Failed to create session: ${error.message}` };
  }
}

export async function deleteSession(sessionId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      return { success: false, message: `Failed to delete session: ${error.message}` };
    }

    revalidatePath('/dashboard');
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: `Failed to delete session: ${error.message}` };
  }
}