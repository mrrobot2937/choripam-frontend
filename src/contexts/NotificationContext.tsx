"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useOrderNotifications } from "../hooks/useOrderNotifications";

interface NotificationContextType {
  newOrdersCount: number;
  isPlaying: boolean;
  stopAlarm: () => void;
  lastCheckTime: Date | null;
  resetNewOrdersCount: () => void;
  restaurantId: string;
  setRestaurantId: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string>("choripam");
  
  const {
    newOrdersCount,
    isPlaying,
    stopAlarm,
    lastCheckTime,
    resetNewOrdersCount
  } = useOrderNotifications(restaurantId, 15000, true);

  return (
    <NotificationContext.Provider value={{
      newOrdersCount,
      isPlaying,
      stopAlarm,
      lastCheckTime,
      resetNewOrdersCount,
      restaurantId,
      setRestaurantId
    }}>
      {children}
    </NotificationContext.Provider>
  );
} 