"""Testes do contrato central: Token, TokenSet, ModelRef."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from spext.core import Fonte, ModelRef, Token, TokenSet


def _token(classe: str = "Intact", conf: float = 0.9) -> Token:
    return Token(classe=classe, dominio="soja", bbox=[0, 0, 10, 20], confianca=conf)


def test_token_valido_e_geometria():
    t = _token()
    assert t.largura == 10
    assert t.altura == 20
    assert t.area == 200


def test_bbox_invalida_ordem():
    with pytest.raises(ValidationError):
        Token(classe="x", dominio="d", bbox=[10, 10, 0, 0], confianca=0.5)


def test_bbox_tamanho_errado():
    with pytest.raises(ValidationError):
        Token(classe="x", dominio="d", bbox=[0, 0, 10], confianca=0.5)


def test_confianca_fora_do_intervalo():
    with pytest.raises(ValidationError):
        Token(classe="x", dominio="d", bbox=[0, 0, 1, 1], confianca=1.5)


def test_campo_extra_proibido():
    with pytest.raises(ValidationError):
        Token(classe="x", dominio="d", bbox=[0, 0, 1, 1], confianca=0.5, foo=1)


def test_tokenset_contagem_por_classe():
    ts = TokenSet(
        tokens=[_token("Intact"), _token("Broken"), _token("Intact")],
        image_size=[640, 480],
        dominio="soja",
        modelo="soja_finetuned_final@v1",
        inferencia_ms=12.3,
    )
    assert ts.total == 3
    assert ts.contagem_por_classe() == {"Intact": 2, "Broken": 1}
    assert ts.fonte is Fonte.UPLOAD
    assert ts.demo_mode is False


def test_modelref_parse_e_str():
    ref = ModelRef.parse("soja_finetuned_final@v3")
    assert ref.nome == "soja_finetuned_final"
    assert ref.versao == "v3"
    assert str(ref) == "soja_finetuned_final@v3"


@pytest.mark.parametrize("ruim", ["sem_arroba", "@v1", "nome@", ""])
def test_modelref_invalida(ruim: str):
    with pytest.raises(ValueError):
        ModelRef.parse(ruim)
