"""Domínio: a unidade de extensão do SPEXT.

Um domínio é declarativo — vocabulário + pipeline + regras. Adicionar um domínio
(inclusive um TCC) não toca no core. Ver ``docs/04-dominios.md``.
"""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .pipeline import PipelineKind
from .versioning import ModelRef


class Feedback(str, Enum):
    """Como o domínio coleta sinal de treino (ver learning loop)."""

    HUMANO = "humano"            # operador confirma/corrige (Baja, Soja)
    AUTOMATICO = "automatico"    # desempenho do sistema é ground truth (Carro)


class Runtime(str, Enum):
    """Onde o domínio roda."""

    NUVEM_BATCH = "nuvem_batch"          # precisão importa, latência não (Baja, Soja)
    BORDA_REALTIME = "borda_realtime"    # < 100 ms no Pi 5 (Carro SENAC)


class Domain(BaseModel):
    """Especificação declarativa de um domínio."""

    model_config = ConfigDict(extra="forbid")

    nome: str
    vocabulario: list[str] = Field(..., min_length=1)
    pipeline: PipelineKind
    modelo: str = Field(..., description="Referência versionada 'nome@versao'.")
    feedback: Feedback
    runtime: Runtime
    thresholds: dict[str, float] = Field(
        default_factory=dict, description="Confiança mínima por classe."
    )
    threshold_padrao: float = Field(default=0.25, ge=0.0, le=1.0)
    decisoes: dict[str, str] = Field(
        default_factory=dict,
        description="classe → decisão de negócio (ex.: 'Intact' → 'premium').",
    )
    descricao: str = ""

    @field_validator("modelo")
    @classmethod
    def _modelo_versionado(cls, v: str) -> str:
        ModelRef.parse(v)  # valida o formato 'nome@versao'
        return v

    def threshold(self, classe: str) -> float:
        """Threshold de confiança para a classe (cai no padrão se não definido)."""
        return self.thresholds.get(classe, self.threshold_padrao)

    def decisao(self, classe: str) -> str | None:
        """Decisão de negócio para a classe, se o domínio definir uma."""
        return self.decisoes.get(classe)

    @property
    def model_ref(self) -> ModelRef:
        return ModelRef.parse(self.modelo)
