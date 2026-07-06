import { useState } from "react";
import { Dashboard } from "@/pages/Dashboard";
import { Feed } from "@/pages/Feed";
import { Profile } from "@/pages/Profile";
import { WeightTracker } from "@/pages/WeightTracker";
import { DietTracker } from "@/pages/DietTracker";
import { Friends } from "@/pages/Friends";
import { Auth } from "@/pages/Auth";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import type { Route } from "@/lib/routes";

export default function App() {
  const { isAuthed, login } = useAuth();
  const [route, setRoute] = useState<Route>("dashboard");

  if (!isAuthed) {
    return <Auth onAuthed={login} />;
  }

  return (
    <div className="flex min-h-screen md:h-screen">
      <Sidebar route={route} onNavigate={setRoute} />

      <div className="flex min-h-screen flex-1 flex-col md:h-screen md:min-h-0 md:overflow-y-auto">
        <TopBar route={route} onNavigate={setRoute} />

        <main className="flex-1">
          {route === "dashboard" && <Dashboard />}
          {route === "feed" && <Feed />}
          {route === "weight" && <WeightTracker />}
          {route === "diet" && <DietTracker />}
          {route === "friends" && <Friends />}
          {route === "profile" && <Profile />}
        </main>
      </div>

      <BottomNav route={route} onNavigate={setRoute} />
    </div>
  );
}
