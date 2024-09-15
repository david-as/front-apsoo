"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CakeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [userName, setUserName] = useState<string>("User");
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.name || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CakeIcon className="w-6 h-6" />
        <span className="font-medium text-lg">Rurafood</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 ">
            <AvatarImage
              src="/placeholder-user.jpg"
              alt="User Avatar"
              className=""
            />
            <AvatarFallback className="bg-green-400">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{userName}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleLogout}
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
