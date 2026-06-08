"""Testes do Perception Core: pipeline + thresholds + semântica de negócio.

Usa o ``StubPipeline`` para exercitar o contrato ponta a ponta sem modelo real.
"""

from __future__ import annotations

from spext.core import (
    DomainRegistry,
    Fonte,
    PerceptionCore,
    PipelineKind,
    PipelineRegistry,
    StubPipeline,
)
from spext.domains import SOJA


def _core_com_stub(deteccoes):
    domains = DomainRegistry()
    domains.register(SOJA)
    pipelines = PipelineRegistry()
    pipelines.register(
        StubPipeline(PipelineKind.SEGMENTACAO_CLASSIFICACAO, deteccoes)
    )
    return PerceptionCore(domains, pipelines)


def test_inspecionar_aplica_decisao_de_negocio():
    core = _core_com_stub(
        [
            ("Intact", 0.9, [0, 0, 10, 10]),
            ("Broken", 0.8, [20, 20, 30, 30]),
        ]
    )
    ts = core.inspecionar(b"fake", "soja", fonte=Fonte.UPLOAD)

    assert ts.total == 2
    assert ts.modelo == "soja_finetuned_final@v1"
    decisoes = {t.classe: t.semantica["decisao"] for t in ts.tokens}
    assert decisoes == {"Intact": "premium", "Broken": "expulso"}


def test_inspecionar_filtra_abaixo_do_threshold():
    # Intact exige 0.55; 0.40 deve ser descartado. Broken (padrão 0.50) com 0.60 passa.
    core = _core_com_stub(
        [
            ("Intact", 0.40, [0, 0, 10, 10]),
            ("Broken", 0.60, [20, 20, 30, 30]),
        ]
    )
    ts = core.inspecionar(b"fake", "soja")

    assert ts.total == 1
    assert ts.tokens[0].classe == "Broken"


def test_fonte_stream_marcada_no_tokenset():
    core = _core_com_stub([("Intact", 0.9, [0, 0, 10, 10])])
    ts = core.inspecionar(b"fake", "soja", fonte=Fonte.STREAM)
    assert ts.fonte is Fonte.STREAM
