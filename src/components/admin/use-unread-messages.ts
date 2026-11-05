"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { clientDb } from "@/lib/firebase/firebase-client";

/** Live count of unread messages, for the badge in the admin menu. */
export function useUnreadMessages(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const q = query(collection(clientDb(), "messages"), where("read", "==", false));
    return onSnapshot(q, (snap) => setCount(snap.size), () => setCount(0));
  }, []);
  return count;
}
