import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api-service';

interface OrderNotificationHook {
    newOrdersCount: number;
    isPlaying: boolean;
    stopAlarm: () => void;
    lastCheckTime: Date | null;
    resetNewOrdersCount: () => void;
}

export const useOrderNotifications = (
    restaurantId: string = 'choripam',
    intervalMs: number = 15000,
    enabled: boolean = true
): OrderNotificationHook => {
    // ARREGLO: Si el restaurantId tiene el prefijo "rest_", quitarlo
    const cleanRestaurantId = restaurantId.startsWith('rest_') ? restaurantId.replace('rest_', '') : restaurantId;
    console.log(`🔧 HOOK: Restaurant ID limpio: ${restaurantId} → ${cleanRestaurantId}`);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
    const [previousOrderIds, setPreviousOrderIds] = useState<Set<string>>(new Set());

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isPlayingRef = useRef(false);
    const isFirstRun = useRef(true);

    // Actualizar ref cuando cambie isPlaying
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    const stopAlarm = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const resetNewOrdersCount = useCallback(() => {
        setNewOrdersCount(0);
    }, []);

    // Función para reproducir alarma
    const playAlarm = useCallback(() => {
        if (isPlayingRef.current) {
            console.log('🔇 Alarma ya está sonando, omitiendo...');
            return;
        }

        console.log('🔊 REPRODUCIENDO ALARMA...');
        setIsPlaying(true);

        try {
            const audioContext = new AudioContext();

            // Primer beep
            const playBeep = (frequency: number, delay: number = 0) => {
                setTimeout(() => {
                    try {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        oscillator.frequency.value = frequency;
                        oscillator.type = 'square';
                        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

                        oscillator.start();
                        oscillator.stop(audioContext.currentTime + 1);
                    } catch (e) {
                        console.warn(`Error beep ${frequency}Hz:`, e);
                    }
                }, delay);
            };

            // Secuencia de beeps
            playBeep(1000, 0);    // Inmediato
            playBeep(800, 1200);  // Después de 1.2s
            playBeep(1000, 2400); // Después de 2.4s

            // Limpiar después de 3.5s
            setTimeout(() => {
                setIsPlaying(false);
                audioContext.close().catch(e => console.warn('Error cerrando audio:', e));
            }, 3500);

        } catch (error) {
            console.error('❌ Error en alarma:', error);
            setIsPlaying(false);
        }
    }, []);

    // Configurar intervalo principal  
    useEffect(() => {
        console.log('🔔 Configurando notificaciones:', { enabled, intervalMs, restaurantId: cleanRestaurantId });

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!enabled) {
            console.log('❌ Notificaciones deshabilitadas');
            return;
        }

        let consecutiveErrors = 0;
        const maxErrors = 3;

        // Función de verificación interna
        const checkOrders = async () => {
            try {
                const timestamp = new Date().toISOString();
                console.log(`🔍 [${timestamp}] Verificando nuevos pedidos...`);

                // SIEMPRE forzar actualización para datos frescos
                const response = await apiService.getOrders(cleanRestaurantId, undefined, undefined, true);
                console.log(`📝 [${timestamp}] Respuesta API:`, response);

                if (!response.orders || !Array.isArray(response.orders)) {
                    throw new Error('Respuesta inválida de API');
                }

                // Resetear contador de errores en caso de éxito
                consecutiveErrors = 0;

                // Filtrar órdenes relevantes para notificaciones 
                const relevantOrders = response.orders.filter(order =>
                    order.status === 'pending' || order.status === 'confirmed'
                );
                console.log(`⏳ [${timestamp}] Órdenes relevantes:`, relevantOrders.length, relevantOrders.map(o => ({
                    id: o.order_id,
                    status: o.status,
                    method: o.delivery_method,
                    customer: o.customer_name
                })));

                const currentOrderIds = new Set(relevantOrders.map(order => order.order_id));
                console.log(`🆔 [${timestamp}] IDs actuales:`, Array.from(currentOrderIds));
                console.log(`🆔 [${timestamp}] IDs anteriores:`, Array.from(previousOrderIds));

                // En el primer run, solo establecer el estado
                if (isFirstRun.current) {
                    console.log(`🎯 [${timestamp}] Primera ejecución - estableciendo estado base`);
                    isFirstRun.current = false;
                    setPreviousOrderIds(currentOrderIds);
                    setLastCheckTime(new Date());
                    return;
                }

                // Detectar nuevas órdenes
                const newOrders = [...currentOrderIds].filter(id => !previousOrderIds.has(id));
                console.log(`🆕 [${timestamp}] Nuevos pedidos detectados:`, newOrders);

                if (newOrders.length > 0) {
                    console.log(`🚨 [${timestamp}] ¡ALARMA! Nuevos pedidos:`, newOrders.length);

                    // Incrementar contador
                    setNewOrdersCount(prev => {
                        const newCount = prev + newOrders.length;
                        console.log(`📊 [${timestamp}] Contador actualizado: ${prev} → ${newCount}`);
                        return newCount;
                    });

                    // Reproducir alarma - SIEMPRE intentar sonar
                    console.log(`🔊 [${timestamp}] FORZANDO REPRODUCCIÓN DE ALARMA...`);
                    playAlarm();

                    // Notificación del navegador
                    if ('Notification' in window && Notification.permission === 'granted') {
                        console.log(`📢 [${timestamp}] Enviando notificación del navegador...`);
                        new Notification('¡Nuevo Pedido!', {
                            body: `${newOrders.length} nuevo(s) pedido(s) pendiente(s)`,
                            icon: '/favicon.ico',
                            tag: 'new-order'
                        });
                    } else {
                        console.log(`🔕 [${timestamp}] Notificaciones del navegador no disponibles`);
                    }
                }

                // Actualizar estado
                setPreviousOrderIds(currentOrderIds);
                setLastCheckTime(new Date());
                console.log(`✅ [${timestamp}] Verificación completada`);

            } catch (error) {
                consecutiveErrors++;
                const timestamp = new Date().toISOString();
                console.error(`❌ [${timestamp}] Error verificando pedidos (${consecutiveErrors}/${maxErrors}):`, error);

                // Si hay muchos errores consecutivos, detener las notificaciones temporalmente
                if (consecutiveErrors >= maxErrors) {
                    console.warn(`⚠️ [${timestamp}] Demasiados errores consecutivos, pausando notificaciones por 1 minuto...`);
                    setTimeout(() => {
                        consecutiveErrors = 0;
                        console.log(`🔄 [${timestamp}] Reiniciando notificaciones después de pausa...`);
                    }, 60000); // 1 minuto
                }
            }
        };

        // Primera verificación inmediata
        console.log('🚀 Iniciando primera verificación...');
        checkOrders();

        // Configurar intervalo
        console.log(`⏰ Configurando intervalo cada ${intervalMs}ms`);
        intervalRef.current = setInterval(() => {
            if (consecutiveErrors < maxErrors) {
                console.log('⏰ Ejecutando verificación por intervalo...');
                checkOrders();
            } else {
                console.log('⏸️ Saltando verificación por errores consecutivos...');
            }
        }, intervalMs);

        return () => {
            console.log('🧹 Limpiando intervalo...');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, intervalMs, cleanRestaurantId, playAlarm, previousOrderIds]);

    // Solicitar permisos de notificación
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('📢 Permisos de notificación:', permission);
            });
        }
    }, []);

    return {
        newOrdersCount,
        isPlaying,
        stopAlarm,
        lastCheckTime,
        resetNewOrdersCount
    };
}; 