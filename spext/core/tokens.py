"""Contrato central do SPEXT: ``Token`` e ``TokenSet``.

Tudo no SPEXT produz ou consome estes objetos — é a interface que faz domínios
e pipelines diferentes serem o mesmo sistema. Ver
``docs/03-contrato-de-token.md``.

Os nomes de campo seguem o contrato documentado (em português) para manter
documentação e código em sincronia.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Fonte(str, Enum):
    """De onde veio a imagem que originou o ``TokenSet``."""

    UPLOAD = "upload"   # imagem enviada (Baja, Soja)
    STREAM = "stream"   # frame de câmera em tempo real (Carro SENAC)


class Token(BaseModel):
    """Uma região da imagem com significado e confiança.

    Um defeito de pintura, um grão de soja ou um obstáculo na pista são, para o
    core, o mesmo objeto. O que muda é a ``classe`` (do vocabulário do domínio)
    e a ``semantica`` (preenchida pelo domínio, não pelo core).
    """

    model_config = ConfigDict(extra="forbid")

    classe: str = Field(..., description="Rótulo do vocabulário do domínio.")
    dominio: str = Field(..., description="Domínio que produziu o token.")
    bbox: list[float] = Field(
        ...,
        min_length=4,
        max_length=4,
        description="Caixa em pixels na imagem original: [x1, y1, x2, y2].",
    )
    confianca: float = Field(..., ge=0.0, le=1.0)
    mask: list[list[float]] | None = Field(
        default=None, description="Máscara de segmentação opcional (polígono)."
    )
    embedding: list[float] | None = Field(
        default=None,
        description="Representação vetorial opcional (habilita busca/similaridade).",
    )
    semantica: dict[str, Any] = Field(
        default_factory=dict,
        description="Semântica de negócio do domínio (ex.: {'decisao': 'expulso'}).",
    )

    @field_validator("bbox")
    @classmethod
    def _bbox_coerente(cls, v: list[float]) -> list[float]:
        x1, y1, x2, y2 = v
        if x2 < x1 or y2 < y1:
            raise ValueError(
                "bbox deve ser [x1, y1, x2, y2] com x2 >= x1 e y2 >= y1."
            )
        return v

    @property
    def largura(self) -> float:
        return self.bbox[2] - self.bbox[0]

    @property
    def altura(self) -> float:
        return self.bbox[3] - self.bbox[1]

    @property
    def area(self) -> float:
        return self.largura * self.altura


class TokenSet(BaseModel):
    """O resultado de tokenizar uma imagem: o agregado de tokens + metadados.

    Carrega a **versão exata** do modelo (``modelo``) que o gerou — essencial
    para o learning loop e para reprodutibilidade científica.
    """

    model_config = ConfigDict(extra="forbid")

    tokens: list[Token] = Field(default_factory=list)
    image_size: list[int] = Field(
        ..., min_length=2, max_length=2, description="[largura, altura] em pixels."
    )
    dominio: str
    modelo: str = Field(
        ..., description="Versão exata que gerou os tokens, ex.: 'soja_final@v3'."
    )
    inferencia_ms: float = Field(..., ge=0.0)
    fonte: Fonte = Fonte.UPLOAD
    demo_mode: bool = Field(
        default=False,
        description="True enquanto pesos genéricos/não fine-tuned são usados.",
    )

    @property
    def total(self) -> int:
        return len(self.tokens)

    def contagem_por_classe(self) -> dict[str, int]:
        """Quantos tokens de cada classe — base de contagem (ex.: grãos)."""
        contagem: dict[str, int] = {}
        for t in self.tokens:
            contagem[t.classe] = contagem.get(t.classe, 0) + 1
        return contagem
