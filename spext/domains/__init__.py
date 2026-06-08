"""Domínios plugados na plataforma + fábricas de registry/pipelines.

Adicionar um domínio = criar o módulo declarativo e registrá-lo aqui.
"""

from __future__ import annotations

from ..core import (
    DetectionPipeline,
    DomainRegistry,
    PerceptionCore,
    PipelineRegistry,
    SegmentationClassificationPipeline,
)
from .baja import BAJA
from .carro_senac import CARRO_SENAC
from .soja import SOJA

__all__ = [
    "BAJA",
    "SOJA",
    "CARRO_SENAC",
    "build_default_registry",
    "build_default_pipelines",
    "build_core",
]


def build_default_registry() -> DomainRegistry:
    """Registry com os três primeiros domínios do SPEXT."""
    registry = DomainRegistry()
    registry.register(BAJA)
    registry.register(SOJA)
    registry.register(CARRO_SENAC)
    return registry


def build_default_pipelines() -> PipelineRegistry:
    """Pipelines reais (ainda esqueletos até integrar os modelos)."""
    pipelines = PipelineRegistry()
    pipelines.register(DetectionPipeline())
    pipelines.register(SegmentationClassificationPipeline())
    return pipelines


def build_core() -> PerceptionCore:
    """Perception Core pronto com domínios e pipelines padrão."""
    return PerceptionCore(build_default_registry(), build_default_pipelines())
