# Saga — Changelog de Inspeção Granular

> Modelo flagship do SPEXT para inspeção de grãos, quantificação de lotes e
> detecção de anomalias. Pipeline: OpenCV (recorte) → EfficientNet-B0 (classificação).
> Hospedado em HF Space: `guguinhaxd-soja-inspection`.

---

## v0 — Treino Inicial

**Status:** Em produção  
**Pipeline:** OpenCV recorta ROI → EfficientNet-B0 classifica  
**Deploy:** HF Space (FastAPI · POST `/inspect` com `image_base64`)

### Métricas

| Métrica | Valor |
|---|---|
| Acurácia (dataset) | 85% |
| Acurácia (produção real) | 64% |
| Gap de domain shift | −21 pp |

### Observações

- Acurácia de 85% foi medida no dataset de validação curado.
- Na produção real o desempenho caiu para 64%, indicando **domain shift**: imagens reais têm variações de iluminação, ângulo e umidade não representadas no dataset original.
- A diferença de 21 pontos percentuais motivou a estratégia de coleta contínua de correções humanas para o ciclo de fine-tuning v1.

### Capacidades em produção

- Classificação de grãos (por classe de qualidade)
- Detecção de anomalias em lote
- Quantificação de objetos em alta quantidade
- Retorna: `class_name`, `confidence`, `inference_ms`, `model`

### Roadmap declarado

- Tokenização semântica por imagem (horizonte v2+)

---

## Meta v1 — Em andamento

**Progresso de correções:** 57 / 500  
**Objetivo:** Dataset de correções humanas suficiente para fine-tuning supervisionado e reduzir o gap de domain shift.

### O que conta como correção

Cada imagem inspecionada pelo usuário onde o humano confirma ou corrige a predição vira um par `(imagem, label_correto)` no dataset de correções. O acúmulo de 500 pares é o gatilho para o treino do fine-tuning v1.

### Estratégia de fine-tuning v1

1. Coletar 500 correções humanas via plataforma SPEXT.
2. Mixar com dataset original para evitar catastrophic forgetting.
3. Retreinar EfficientNet-B0 com data augmentation focado nas variações de produção.
4. Validar com holdout separado de imagens reais (não do dataset original).
5. Deploy como `saga@v1` no HF Space.

---

## Arquitetura do pipeline

```
Imagem (base64 JSON POST)
    │
    ▼
HF Space — FastAPI
    │
    ├─ OpenCV
    │    └─ Recorte / resize / normalização
    │
    ├─ EfficientNet-B0 (.keras, Google Drive)
    │    └─ Softmax → classe + confiança
    │
    └─ Response JSON
         { class_name, confidence, inference_ms, model }
```

**Pesos:** Arquivo `.keras` versionado no Google Drive.  
**Borda:** Exportável para TFLite/ONNX para inferência no Raspberry Pi 5 (<100 ms).

---

## Contexto no SPEXT

Saga é o modelo de **maior poder** da plataforma (equivalente ao Opus na linha Anthropic).
Enquanto Magnus (Magnus) trata objetos grandes e esparsos com detecção YOLO,
Saga trata **alta densidade de objetos pequenos** com classificação por recorte — paradigma
completamente diferente, mas ambos produzem o mesmo contrato de **Token SPEXT**:

```
Token {
  classe: string
  confiança: float
  bbox: null | [x, y, w, h]
  domínio: "grains"
  semântica: string | null
}
```

---

## Roadmap futuro (Vigil)

Com a unificação dos modelos sob a marca **Vigil**, Saga passará a ser o pipeline
de grãos/objetos densos dentro de uma API única. Um **router leve** (MobileNetV2,
~2 ms) detectará automaticamente o domínio da imagem e despachará para o pipeline
correto — sem necessidade de o usuário escolher entre modelos.

```
Imagem → Router v0 (grão | superfície) → Saga ou Magnus → Token[ ]
```

---

*Gerado em 2026-06-14 · Plataforma SPEXT v0.1*
