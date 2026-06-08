"""Domínio Carro SENAC — direção autônoma (RASCUNHO).

Único domínio de **borda em tempo real** e de **feedback automático** (o
desempenho do carro é ground truth). Vocabulário e pipeline ainda a definir —
registrado como rascunho para já exercitar a borda no Pi 5. Ver docs/04 e docs/05.
"""

from __future__ import annotations

from ..core import Domain, Feedback, PipelineKind, Runtime

CARRO_SENAC = Domain(
    nome="carro_senac",
    descricao="RASCUNHO — percepção para carro autônomo de brinquedo (SENAC).",
    vocabulario=[
        "faixa",
        "obstaculo",
        "cone",
        "linha_chegada",
    ],
    pipeline=PipelineKind.DETECCAO,  # provisório: detector leve real-time
    modelo="carro_senac@rascunho",
    feedback=Feedback.AUTOMATICO,
    runtime=Runtime.BORDA_REALTIME,
    threshold_padrao=0.35,
    decisoes={
        "obstaculo": "desviar",
        "linha_chegada": "parar",
    },
)
