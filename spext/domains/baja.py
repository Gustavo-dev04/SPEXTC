"""Domínio Baja — inspeção de pintura de chassi.

AI: **Saga** (YOLOv8n fine-tuned, mAP50=0.989).
Pipeline de detecção. Modelo real em produção no HF Space.
Origem: repo ``Gustavo-dev04/Baja``, branch ``claude/paint-inspection-ai-FRk8g``.

Classes com treino (v0): casca_de_laranja, escorrimento, bolha, water_spotting.
Classes planejadas para v1 (YOLO11s, 8 classes): + falha_cobertura, risco, oxidacao, + 1.
"""

from __future__ import annotations

from ..core import Domain, Feedback, PipelineKind, Runtime

# Classes treinadas na v0 do Saga.
_CLASSES_V0 = [
    "casca_de_laranja",
    "escorrimento",
    "bolha",
    "water_spotting",
]

# Classes planejadas para v1 (ainda sem dataset de treino).
_CLASSES_V1_PLANEJADAS = [
    "falha_cobertura",
    "risco",
    "oxidacao",
]

BAJA = Domain(
    nome="baja",
    descricao=(
        "Detecção de defeitos de pintura em chassi BAJA SAE — AI: Saga. "
        "YOLOv8n fine-tuned (mAP50=0.989, 4 classes). "
        "HF Space: Guguinhaxd/baja-paint-inspection. "
        "V1 planejado: YOLO11s, 8 classes, 6 datasets curados."
    ),
    vocabulario=_CLASSES_V0,
    pipeline=PipelineKind.DETECCAO,
    modelo="saga@v0",  # hf://Guguinhaxd/baja-paint-models/best.pt
    feedback=Feedback.HUMANO,
    runtime=Runtime.NUVEM_BATCH,
    threshold_padrao=0.25,
    decisoes={
        "casca_de_laranja": "defeito",
        "escorrimento": "defeito",
        "bolha": "defeito",
        "water_spotting": "defeito",
    },
)
