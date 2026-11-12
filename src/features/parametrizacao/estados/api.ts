//src/features/parametrizacao/estados/api.tsimport { EstadoResponse, Estado } from './types';

import { httpClient } from "@/lib/http/client";
import { EstadoResponse } from "./types";


export const Estados = {
    listar: () => httpClient.get<EstadoResponse>('/api/sistema/estados'),
}