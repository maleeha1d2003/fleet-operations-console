import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export interface OfflineAction {
  id: string;
  type: "vehicle-inspected";
  vehicleId: string;
  createdAt: string;
}

interface OfflineActionContextValue {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  lastActionMessage: string;
  queueInspection: (vehicleId: string) => void;
}

const STORAGE_KEY = "fleet-console-pending-actions";

const OfflineActionContext =
  createContext<OfflineActionContextValue | null>(null);

function readPendingActions(): OfflineAction[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as OfflineAction[]) : [];
  } catch {
    return [];
  }
}

export function OfflineActionProvider({
  children,
}: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine,
  );
  const [pendingActions, setPendingActions] =
    useState<OfflineAction[]>(readPendingActions);
  const [lastActionMessage, setLastActionMessage] = useState("");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(pendingActions),
      );
    } catch {
      setLastActionMessage(
        "Browser storage is unavailable; pending actions may not survive a reload.",
      );
    }
  }, [pendingActions]);

  useEffect(() => {
    if (!isOnline || pendingActions.length === 0) return;

    // This project uses a mock dispatcher because there is no backend API.
    // Treat queued actions as dispatched when connectivity returns.
    const count = pendingActions.length;

    setPendingActions([]);
    setLastActionMessage(
      `${count} queued action${count === 1 ? "" : "s"} dispatched after reconnection.`,
    );
  }, [isOnline, pendingActions]);

  const queueInspection = useCallback(
    (vehicleId: string) => {
      const action: OfflineAction = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "vehicle-inspected",
        vehicleId,
        createdAt: new Date().toISOString(),
      };

      if (isOnline) {
        setLastActionMessage(
          `Inspection action for ${vehicleId} dispatched.`,
        );
        return;
      }

      setPendingActions((current) => [...current, action]);
      setLastActionMessage(
        `Inspection action for ${vehicleId} saved. It will be dispatched when you reconnect.`,
      );
    },
    [isOnline],
  );

  const value = useMemo(
    () => ({
      isOnline,
      pendingActions,
      lastActionMessage,
      queueInspection,
    }),
    [isOnline, pendingActions, lastActionMessage, queueInspection],
  );

  return (
    <OfflineActionContext.Provider value={value}>
      {children}
    </OfflineActionContext.Provider>
  );
}

export function useOfflineActions() {
  const context = useContext(OfflineActionContext);

  if (!context) {
    throw new Error(
      "useOfflineActions must be used inside OfflineActionProvider",
    );
  }

  return context;
}