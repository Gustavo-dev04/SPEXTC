"""Domínio Baja — inspeção de pintura de chassi.

Pipeline de detecção (YOLO). Protótipo em modo demo: pesos genéricos até o
fine-tune com defeitos reais. Origem: repo ``Gustavo-dev04/Baja``.
"""

from __future__ import annotations

from ..core import Domain, Feedback, PipelineKind, Runtime

BAJA = Domain(
    nome="baja",
    descricao="Detecção de defeitos de pintura em chassi estilo BAJA SAE.",
    vocabulario=[
        "escorrimento",
        "casca_de_laranja",
        "falha_cobertura",
        "bolha",
        "risco",
        "oxidacao",
    ],
    pipeline=PipelineKind.DETECCAO,
    modelo="yolov8n@demo",  # COCO-pretrained, ainda não fine-tuned
    feedback=Feedback.HUMANO,
    runtime=Runtime.NUVEM_BATCH,
    threshold_padrao=0.25,
    decisoes={
        "oxidacao": "critico",       # corrosão — prioridade alta
        "escorrimento": "defeito",
        "casca_de_laranja": "defeito",
        "falha_cobertura": "defeito",
        "bolha": "defeito",
        "risco": "defeito",
    },
)
