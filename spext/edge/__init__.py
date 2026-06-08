"""Metade de borda do SPEXT — roda no Raspberry Pi 5.

Regra de ouro: a borda **só infere e coleta**, nunca treina. Ver docs/05.
"""

from .runtime import EdgeRuntime

__all__ = ["EdgeRuntime"]
