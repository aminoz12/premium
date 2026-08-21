"use client";

import { useEffect, useState } from "react";
import HomePage from "./home";
import EditingVideo from "./editing-video";
import { useLocation } from "./router";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {location === "/" && <HomePage />}
      {location === "/edit" && <EditingVideo />}
    </>
  );
}
