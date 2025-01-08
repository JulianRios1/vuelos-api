// src/types/itinerario.d.ts
export interface Itinerario {
    idVuelo: string;
    tipoVuelo: 'Charter' | 'Cargo';
    estadoVuelo: string;
    cantidadTripulantes: number;
    pesoCarga?: number;
    cantidadPasajeros: number;
    fechaSalida: string;
    destino: string;
    observaciones?: string;
    rutaVouchers?: string;
    rutaAprobacionAerocivil?: string;
    createdAt: string;
  }