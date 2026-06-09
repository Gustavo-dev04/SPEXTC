"""Testes do Domain Registry e dos domínios padrão."""

from __future__ import annotations

import pytest

from spext.core import DomainRegistry, PipelineKind, Runtime
from spext.domains import BAJA, CARRO_SENAC, SOJA, build_default_registry


def test_registry_register_get_list():
    reg = DomainRegistry()
    reg.register(BAJA)
    assert reg.get("baja") is BAJA
    assert reg.names() == ["baja"]


def test_registry_duplicado():
    reg = DomainRegistry()
    reg.register(SOJA)
    with pytest.raises(ValueError):
        reg.register(SOJA)


def test_registry_inexistente():
    reg = DomainRegistry()
    with pytest.raises(KeyError):
        reg.get("nao_existe")


def test_default_registry_tem_tres_dominios():
    reg = build_default_registry()
    assert set(reg.names()) == {"baja", "soja", "carro_senac"}


def test_baja_eh_deteccao_nuvem():
    assert BAJA.pipeline is PipelineKind.DETECCAO
    assert BAJA.runtime is Runtime.NUVEM_BATCH
    # Modelo real: Saga v0 (YOLOv8n fine-tuned, mAP50=0.989)
    assert BAJA.model_ref.nome == "saga"
    assert BAJA.model_ref.versao == "v0"
    # 4 classes com treino na v0
    assert set(BAJA.vocabulario) == {
        "casca_de_laranja", "escorrimento", "bolha", "water_spotting"
    }


def test_soja_eh_segmentacao_classificacao():
    assert SOJA.pipeline is PipelineKind.SEGMENTACAO_CLASSIFICACAO
    assert SOJA.decisao("Intact") == "premium"
    assert SOJA.decisao("Broken") == "expulso"
    assert SOJA.threshold("Intact") == 0.55
    assert SOJA.threshold("Broken") == 0.50  # cai no padrão


def test_carro_eh_borda_realtime_automatico():
    assert CARRO_SENAC.runtime is Runtime.BORDA_REALTIME
    assert CARRO_SENAC.feedback.value == "automatico"
