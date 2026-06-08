"""Pipelines de tokenização: como uma imagem vira um ``TokenSet``.

O ponto central do SPEXT (ver ``docs/03``): domínios diferentes tokenizam de
formas diferentes — detecção (YOLO, da Baja) e segmentação+classificação
(OpenCV + EfficientNet, da Soja) — e mesmo assim produzem o **mesmo** contrato.
Por isso o core aceita múltiplos pipelines plugáveis.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from enum import Enum
from typing import TYPE_CHECKING

from .tokens import TokenSet

if TYPE_CHECKING:  # evita import circular em tempo de execução
    from .domain import Domain


class PipelineKind(str, Enum):
    """Os tipos de pipeline que o core conhece."""

    DETECCAO = "deteccao"                          # YOLO/RT-DETR — caixa nativa
    SEGMENTACAO_CLASSIFICACAO = "segmentacao_classificacao"  # OpenCV + classificador
    PATCH_EMBEDDING = "patch_embedding"            # ViT — futuro
    CODEBOOK_DISCRETO = "codebook_discreto"        # VQ-VAE — futuro


class Pipeline(ABC):
    """Transforma bytes de imagem em um ``TokenSet``.

    Subclasses concretas integram o modelo real (YOLO, EfficientNet, ...). O
    core nunca sabe qual é — só pede ``tokenize``.
    """

    kind: PipelineKind

    @abstractmethod
    def tokenize(self, imagem: bytes, domain: "Domain") -> TokenSet:
        """Produz o ``TokenSet`` da imagem para o domínio dado."""
        raise NotImplementedError


class PipelineRegistry:
    """Mapeia ``PipelineKind`` → instância de pipeline."""

    def __init__(self) -> None:
        self._pipelines: dict[PipelineKind, Pipeline] = {}

    def register(self, pipeline: Pipeline) -> None:
        self._pipelines[pipeline.kind] = pipeline

    def get(self, kind: PipelineKind) -> Pipeline:
        if kind not in self._pipelines:
            raise KeyError(
                f"Nenhum pipeline registrado para {kind!r}. "
                f"Registrados: {sorted(k.value for k in self._pipelines)}"
            )
        return self._pipelines[kind]

    def kinds(self) -> list[PipelineKind]:
        return list(self._pipelines)
