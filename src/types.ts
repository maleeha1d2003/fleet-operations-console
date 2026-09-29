export type VehicleStatus = "Available" | "En Route" | "Delayed" | "Idle" | "Offline";
export interface Vehicle { id:string; registration:string; driver:string; status:VehicleStatus; location:string; speed:number; latitude:number; longitude:number; updatedAt:string; }
