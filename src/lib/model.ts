export type Cue = {
  id: string;
  session_id: string;
  title: string;
  speaker: string;
  duration: number;
  remaining_time: number;
  status: 'active' | 'queued' | 'completed';
  is_playing: boolean;
  order: number;
  created_at: string;
  last_modified: string;
};

export type Session = {
  id: string;
  title: string;
  segments: number;
  totalDuration: string;
  lastModified: string;
};

export type CueState = {
  id: string;
  is_paused: boolean;
  host_message: string;
  screen_state: 'normal' | 'flashing' | 'blackout';
};

export type Devices = {
  id: number;
  session_id: string
  name: string;
};

export type Messages = {
  id: number;
  session_id: string
  message: string;
};