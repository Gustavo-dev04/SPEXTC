# 07 — Modelos e Datasets (inventário)

Registro do que **já existe e funciona**, e onde está. É o ponto de partida do
Model Registry e do versionamento descritos em
[`06-learning-loop.md`](06-learning-loop.md).

> Aviso: datasets e modelos estão em **melhoria progressiva**. Este inventário é
> um retrato; a fonte da verdade será o registro versionado quando o SPEXT tiver
> código.

## Modelos da Soja (treinados, no Google Drive)

Todos EfficientNet-B0 em formato Keras (`.keras`), pipeline de
**classificação** (recebem um recorte de grão, devolvem uma classe):

| Arquivo | Tamanho | Papel |
|---|---|---|
| `soja_phase1_best.keras` | ~17 MB | melhor da fase 1 (transfer learning inicial) |
| `soja_phase2_best.keras` | ~29 MB | melhor da fase 2 (fine-tuning) |
| `soja_model_final.keras` | ~29 MB | modelo final |
| `soja_finetuned_best.keras` | ~29 MB | melhor do fine-tuning com fotos próprias |
| `soja_finetuned_final.keras` | ~29 MB | fine-tuned final |

Acompanham:
- `soja_classes.json` — ordem das classes: `Broken`, `Immature`, `Intact`,
  `Skin-damaged`, `Spotted`.
- `soja_confusion_matrix.png` — matriz de confusão da avaliação.

> Essas fases (`phase1 → phase2 → final → finetuned`) já são, na prática, um
> **histórico de versões progressivas**. O SPEXT formaliza isso no Model
> Registry.

## Dataset da Soja

- **Nome:** SoyaBeans Classifications v2 (export Roboflow).
- **Fonte:** Roboflow Universe (hansaka-sudusinghe), licença MIT.
- **Tamanho:** ~12.528 imagens, 400×400 px (redimensionadas para 224×224 no
  pipeline Keras).
- **Splits:** `train/` + `valid/` + `test/`, organizados por pasta de classe.
- **Localização:** Google Drive (5 pastas de classe + extras). Existe uma pasta
  `Part of the original soybean images` que **deve ser ignorada** (passar
  `class_names` explícito ao carregar).
- **Evolução prevista:** coleta própria (fotos de celular, fundo escuro, luz
  difusa) para mitigar *domain shift* e fine-tuning progressivo.

## Modelo e dataset da Baja

- **Modelo:** YOLO (Ultralytics) em **modo demo** — `yolov8n.pt` (COCO) com
  mapeamento de classes genéricas para defeitos de pintura. **Ainda não há peso
  fine-tuned** para os defeitos reais.
- **Vocabulário alvo (6):** `escorrimento`, `casca_de_laranja`,
  `falha_cobertura`, `bolha`, `risco`, `oxidacao`.
- **Dataset:** a construir (meta 500–1000 imagens de chassis pintados, rotulação
  Roboflow/CVAT, formato YOLO txt). Em melhoria progressiva.

## Os dois paradigmas, lado a lado

| | Baja | Soja |
|---|---|---|
| Pipeline | detecção (YOLO) | segmentação OpenCV + classificação EfficientNet |
| Caixa vem de | a própria rede | recorte do OpenCV |
| Formato do peso | `.pt` (Ultralytics) | `.keras` (TensorFlow) |
| Export p/ borda | ONNX | TFLite |
| Estado | demo (sem fine-tune) | treinado e funcionando |

Essa diferença é **a justificativa central** do contrato de token: dois
paradigmas, dois frameworks, dois formatos de peso — e mesmo `TokenSet` na saída.

## Acesso (estado desta sessão)

- **Código** de Baja e Soja: acessível (clonado direto do GitHub).
- **Modelos `.keras`** da Soja: localizados no Google Drive (somente leitura via
  ferramentas desta sessão).
- **Hugging Face** (`Guguinhaxd`): não confirmado nesta sessão (conexão caiu
  durante a busca). A revisitar quando for necessário publicar/baixar pesos.

## O que falta para virar Model Registry de verdade

1. Mover/registrar os pesos com **versão + métricas + dataset de origem**.
2. Padronizar export: Keras→TFLite e YOLO→ONNX, quantizados para o Pi 5.
3. Carimbar `modelo@versao` em todo `TokenSet`.
