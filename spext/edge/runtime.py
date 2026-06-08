"""Runtime de borda (Pi 5) — ESQUELETO.

Carrega um modelo exportado (TFLite/ONNX), infere localmente sem depender de
rede, produz o mesmo ``TokenSet`` da nuvem e guarda um buffer local de
(frame + resultado da ação) para o learning loop. Ver docs/05 e docs/06.

A inferência real ainda não está implementada — este arquivo fixa o contrato e
o ciclo de vida que o runtime de borda deve seguir.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from ..core import Domain, TokenSet


@dataclass
class EdgeRuntime:
    """Ciclo de vida do SPEXT na borda."""

    domain: Domain
    modelo_path: str                       # artefato exportado (.tflite / .onnx)
    versao_pinada: str                     # versão exata carregada (rastreável)
    _buffer: list[dict[str, Any]] = field(default_factory=list, repr=False)

    def carregar(self) -> None:
        """Carrega o modelo exportado para inferência local."""
        raise NotImplementedError(
            "Carregar o modelo exportado (tflite_runtime / onnxruntime) no Pi 5."
        )

    def inferir(self, frame: bytes) -> TokenSet:
        """Infere localmente um frame → TokenSet. Não depende de rede."""
        raise NotImplementedError(
            "Rodar o modelo exportado e montar o TokenSet (mesmo contrato do core)."
        )

    def registrar_feedback(self, frame: bytes, resultado_acao: dict[str, Any]) -> None:
        """Guarda (frame + o que aconteceu) no buffer local para o learning loop.

        Resiliente a ficar offline: só sincroniza com a nuvem quando há rede.
        """
        self._buffer.append({"frame": frame, "resultado": resultado_acao})

    def sincronizar(self) -> int:
        """Envia o buffer para a nuvem quando há rede. Retorna itens enviados."""
        raise NotImplementedError(
            "Enviar o buffer para a ingestão da nuvem e limpar o buffer local."
        )

    @property
    def pendentes(self) -> int:
        return len(self._buffer)
