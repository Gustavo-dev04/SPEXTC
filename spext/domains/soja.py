"""Domínio Soja — classificação de grãos.

Pipeline de segmentação (OpenCV recorta cada grão) + classificação
(EfficientNet-B0 .keras já treinado). Classes em inglês, como no dataset; a
decisão de negócio mapeia para Premium / Expulso. Origem: repo
``Gustavo-dev04/soja-inspectio-``. Ver docs/07 para o inventário de modelos.
"""

from __future__ import annotations

from ..core import Domain, Feedback, PipelineKind, Runtime

SOJA = Domain(
    nome="soja",
    descricao="Classificação de grãos de soja por imagem (EfficientNet-B0).",
    vocabulario=[
        "Broken",
        "Immature",
        "Intact",
        "Skin-damaged",
        "Spotted",
    ],
    pipeline=PipelineKind.SEGMENTACAO_CLASSIFICACAO,
    modelo="soja_finetuned_final@v1",  # peso real no Google Drive (ver docs/07)
    feedback=Feedback.HUMANO,
    runtime=Runtime.NUVEM_BATCH,
    threshold_padrao=0.50,
    thresholds={
        # Grão íntegro pode exigir mais confiança para virar Premium.
        "Intact": 0.55,
    },
    decisoes={
        "Intact": "premium",
        "Broken": "expulso",
        "Immature": "expulso",
        "Skin-damaged": "expulso",
        "Spotted": "expulso",
    },
)
