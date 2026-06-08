"""Perception Core: orquestra Camada 1 (pipeline) + Camada 2 (semântica).

Dado um domínio e uma imagem, escolhe o pipeline registrado, gera os tokens,
aplica os thresholds do domínio e carimba a decisão de negócio em cada token.
Ver ``docs/02-arquitetura.md``.
"""

from __future__ import annotations

from .pipeline import PipelineRegistry
from .registry import DomainRegistry
from .tokens import Fonte, TokenSet


class PerceptionCore:
    """O motor agnóstico de domínio: imagem → tokens enriquecidos."""

    def __init__(
        self, domains: DomainRegistry, pipelines: PipelineRegistry
    ) -> None:
        self.domains = domains
        self.pipelines = pipelines

    def inspecionar(
        self, imagem: bytes, dominio: str, fonte: Fonte = Fonte.UPLOAD
    ) -> TokenSet:
        dom = self.domains.get(dominio)
        pipe = self.pipelines.get(dom.pipeline)

        token_set = pipe.tokenize(imagem, dom)
        token_set.fonte = fonte

        # Camada 2: aplica thresholds e semântica de negócio do domínio.
        filtrados = []
        for token in token_set.tokens:
            if token.confianca < dom.threshold(token.classe):
                continue
            decisao = dom.decisao(token.classe)
            if decisao is not None:
                token.semantica.setdefault("decisao", decisao)
            filtrados.append(token)

        token_set.tokens = filtrados
        return token_set
