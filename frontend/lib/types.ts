export type Dominio = 'baja' | 'soja'

export type ModeloStatus = 'active' | 'candidate' | 'archived'

export interface Modelo {
  id: string
  dominio: Dominio
  nome: string
  versao: string
  pipeline: string
  status: ModeloStatus
  metricas: Record<string, number | string>
  dataset_versao: string | null
  descricao: string | null
  created_at: string
}

export type MelhoriaTipo =
  | 'treino_inicial'
  | 'fine_tuning'
  | 'fine_tuning_validacao'
  | 'dataset'

export interface Melhoria {
  id: string
  dominio: Dominio
  tipo: MelhoriaTipo
  descricao: string
  modelo_antes: string | null
  modelo_depois: string | null
  metrica_chave: string | null
  valor_antes: number | null
  valor_depois: number | null
  notas: string | null
  created_at: string
}

export interface Inspecao {
  id: string
  dominio: Dominio
  modelo_ref: string | null
  total_graos: number | null
  resultado_json: Record<string, unknown>
  imagem_url: string | null
  created_at: string
}

export interface Dataset {
  id: string
  dominio: Dominio
  versao: string
  total_amostras: number
  splits: Record<string, number>
  fonte: string | null
  descricao: string | null
  created_at: string
}

export interface BBoxDetection {
  class_name: string
  confidence: number
  bbox: [number, number, number, number]
}

export interface InspectResponse {
  detections: BBoxDetection[]
  inference_ms: number
  model: string
  image_width: number
  image_height: number
}

export interface SojaInspectResponse {
  class_name: string
  confidence: number
  inference_ms: number
  model: string
}
