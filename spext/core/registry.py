"""Domain Registry: o catálogo de domínios plugados na plataforma."""

from __future__ import annotations

from .domain import Domain


class DomainRegistry:
    """Guarda os domínios por nome. Adicionar um domínio é registrar aqui."""

    def __init__(self) -> None:
        self._domains: dict[str, Domain] = {}

    def register(self, domain: Domain) -> None:
        if domain.nome in self._domains:
            raise ValueError(f"Domínio já registrado: {domain.nome!r}")
        self._domains[domain.nome] = domain

    def get(self, nome: str) -> Domain:
        if nome not in self._domains:
            raise KeyError(
                f"Domínio não registrado: {nome!r}. "
                f"Registrados: {sorted(self._domains)}"
            )
        return self._domains[nome]

    def list(self) -> list[Domain]:
        return list(self._domains.values())

    def names(self) -> list[str]:
        return sorted(self._domains)
