import Image from "next/image";
import RequireAuth from "../components/RequireAuth";
import Profile from "../components/profile";
import CombinedForm from "@/components/reports/CombinedForm";

export default function Home() {
  return (
    <RequireAuth>
      <header className="fixed top-0 left-0 w-full h-14 bg-black flex items-center justify-between z-20 shadow-md px-6">
        <div className="text-white text-xl font-bold tracking-tight font-mono">
          lossing-automation
        </div>
        <div>
          <Profile />
        </div>
      </header>
      <div
        className="min-h-screen pt-20 px-4"
        style={{
          background: "linear-gradient(135deg, #1a0000 0%, #ff1a1a  60%, #1a0000 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto pb-12">
          <CombinedForm />
        </div>
      </div>
    </RequireAuth>
  );
}
