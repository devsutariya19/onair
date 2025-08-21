# OnAir Stage Timer

![In Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow.svg)

A real-time, remote timer application designed for managing live events, presentations, and workshops. OnAir provides a host with a comprehensive control center to manage an agenda, while client devices display a clean, synchronized timer view.


## Key Features

* **Host Control Center:** A dashboard view for the host that includes a live preview, agenda management, and session controls.
* **Synchronized Client View:** A clean, full-screen timer display for client devices (laptops, tablets, phones) that stays in sync with the host.
* **Interactive Agenda:** Hosts can click any item in the agenda to make it the active timer.
* **Dynamic Visual Cues:** Hosts can send messages to client devices
* **Overtime Tracking:** The timer seamlessly transitions from counting down to counting up once the time has expired.
* **Broadcast Messaging:** The host can send short messages that appear on all connected client screens.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Real-time Backend:** [Supabase](https://supabase.io/) Realtime

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn

### Installation

1.  **Install NPM packages:**
    ```sh
    npm install
    ```

2.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your Supabase project credentials.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
