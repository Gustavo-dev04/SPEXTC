"""Implementações concretas de pipeline.

- ``DetectionPipeline`` e ``SegmentationClassificationPipeline`` são os
  esqueletos onde os modelos reais (YOLO da Baja, EfficientNet da Soja) serão
  integrados — hoje levantam ``NotImplementedError`` apontando o caminho.
- ``StubPipeline`` é determinístico e não depende de modelo: serve para
  exercitar o contrato ponta a ponta (testes, wiring) antes dos pesos reais.
"""

from __future__ import annotations

import time
from typing import TYPE_CHECKING

from .pipeline import Pipeline, PipelineKind
from .tokens import Fonte, Token, TokenSet

if TYPE_CHECKING:
    from .domain import Domain


class DetectionPipeline(Pipeline):
    """Detecção direta (YOLO/Ultralytics). Usado pela Baja."""

    kind = PipelineKind.DETECCAO

    def tokenize(self, imagem: bytes, domain: "Domain") -> TokenSet:
        raise NotImplementedError(
            "Integrar YOLO (Ultralytics) aqui: predict → boxes → Token. "
            "Ver docs/04-dominios.md (domínio Baja)."
        )


class SegmentationClassificationPipeline(Pipeline):
    """OpenCV recorta cada objeto → classificador rotula. Usado pela Soja."""

    kind = PipelineKind.SEGMENTACAO_CLASSIFICACAO

    def tokenize(self, imagem: bytes, domain: "Domain") -> TokenSet:
        raise NotImplementedError(
            "Integrar OpenCV (threshold → contornos → recorte) + EfficientNet "
            "(.keras) aqui: cada recorte vira um Token. "
            "Ver docs/04-dominios.md (domínio Soja)."
        )


class StubPipeline(Pipeline):
    """Pipeline determinístico para exercitar o contrato sem modelo real.

    Recebe detecções pré-definidas e devolve um ``TokenSet`` válido. Útil para
    testes e para validar a wiring do ``PerceptionCore`` antes dos pesos.
    """

    def __init__(
        self,
        kind: PipelineKind,
        deteccoes: list[tuple[str, float, list[float]]] | None = None,
        image_size: tuple[int, int] = (640, 640),
        demo_mode: bool = True,
    ) -> None:
        self.kind = kind
        self._deteccoes = deteccoes or []
        self._image_size = list(image_size)
        self._demo_mode = demo_mode

    def tokenize(self, imagem: bytes, domain: "Domain") -> TokenSet:
        inicio = time.perf_counter()
        tokens = [
            Token(
                classe=classe,
                dominio=domain.nome,
                bbox=bbox,
                confianca=conf,
            )
            for classe, conf, bbox in self._deteccoes
        ]
        elapsed = (time.perf_counter() - inicio) * 1000.0
        return TokenSet(
            tokens=tokens,
            image_size=self._image_size,
            dominio=domain.nome,
            modelo=domain.modelo,
            inferencia_ms=round(elapsed, 4),
            fonte=Fonte.UPLOAD,
            demo_mode=self._demo_mode,
        )
