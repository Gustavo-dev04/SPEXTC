"""Perception Core do SPEXT — agnóstico de domínio.

Este pacote não sabe o que é "soja" ou "pintura". Só sabe transformar pixels em
tokens (``Token`` / ``TokenSet``) usando o pipeline que o domínio registrou.
"""

from .domain import Domain, Feedback, Runtime
from .perception import PerceptionCore
from .pipeline import Pipeline, PipelineKind, PipelineRegistry
from .pipelines import (
    DetectionPipeline,
    SegmentationClassificationPipeline,
    StubPipeline,
)
from .registry import DomainRegistry
from .tokens import Fonte, Token, TokenSet
from .versioning import ModelRef

__all__ = [
    "Token",
    "TokenSet",
    "Fonte",
    "ModelRef",
    "Domain",
    "Feedback",
    "Runtime",
    "Pipeline",
    "PipelineKind",
    "PipelineRegistry",
    "DetectionPipeline",
    "SegmentationClassificationPipeline",
    "StubPipeline",
    "DomainRegistry",
    "PerceptionCore",
]
