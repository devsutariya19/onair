'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMessage(sessionId: string, message: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('messages')
      .insert([
        { session_id: sessionId, message: message }
      ]);

    if (error) {
      return { success: false, message: `Failed to insert message: ${error.message}` };
    }

    revalidatePath(`/t/${sessionId}/controller`);
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: `Failed to add message: ${error.message}` };
  }
}

export async function deleteMessage(messageId: string, sessionId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('session_id', sessionId);

    if (error) {
      return { success: false, message: `Failed to delete message: ${error.message}` };
    }

    revalidatePath(`/t/${sessionId}/controller`);
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: `Failed to delete message: ${error.message}` };
  }
}
