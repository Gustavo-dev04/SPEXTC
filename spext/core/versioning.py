"""Referência versionada de modelo: ``nome@versao``.

Datasets e modelos melhoram progressivamente (ver ``docs/06-learning-loop.md``).
Toda referência a um modelo carrega versão explícita para rastreabilidade.
"""

from __future__ import annotations

from pydantic import BaseModel


class ModelRef(BaseModel):
    """Identifica um peso treinado de forma reproduzível.

    Exemplos: ``soja_finetuned_final@v3``, ``yolov8n@demo``.
    """

    nome: str
    versao: str

    @classmethod
    def parse(cls, ref: str) -> "ModelRef":
        if "@" not in ref:
            raise ValueError(
                f"Referência de modelo inválida: {ref!r}. Use 'nome@versao'."
            )
        nome, versao = ref.split("@", 1)
        if not nome or not versao:
            raise ValueError(
                f"Referência de modelo inválida: {ref!r}. Use 'nome@versao'."
            )
        return cls(nome=nome, versao=versao)

    def __str__(self) -> str:
        return f"{self.nome}@{self.versao}"
