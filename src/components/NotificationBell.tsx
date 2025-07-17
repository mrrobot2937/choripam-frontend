"use client";

import { useNotifications } from "../contexts/NotificationContext";
import { useState } from "react";

export default function NotificationBell() {
  const { newOrdersCount, isPlaying, stopAlarm, lastCheckTime } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="relative">
      {/* Botón de notificación */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-full transition-colors ${
          newOrdersCount > 0 
            ? 'bg-yellow-600 text-black hover:bg-yellow-500' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {/* Icono de campana */}
        <span className="text-lg">🔔</span>
        
        {/* Badge de notificaciones */}
        {newOrdersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {newOrdersCount > 99 ? '99+' : newOrdersCount}
          </span>
        )}
        
        {/* Indicador de sonido */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Dropdown de información */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              {isPlaying && (
                <button
                  onClick={stopAlarm}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  🔇 Silenciar
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {newOrdersCount > 0 ? (
                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">
                      {newOrdersCount} nuevo(s) pedido(s)
                    </span>
                    <span className="text-yellow-300 text-sm">
                      {isPlaying ? '🔊 Sonando' : '📢 Notificado'}
                    </span>
                  </div>
                  <p className="text-yellow-300 text-sm mt-1">
                    Pedidos pendientes de confirmación
                  </p>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  <span className="text-2xl mb-2 block">✅</span>
                  <p>No hay nuevos pedidos</p>
                </div>
              )}
              
              {lastCheckTime && (
                <div className="text-gray-400 text-xs border-t border-gray-700 pt-2">
                  Última verificación: {formatTime(lastCheckTime)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
} 