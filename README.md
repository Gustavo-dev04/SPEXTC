# SPEXT — Plataforma Acadêmica de Visão Computacional e Tokenização de Imagens

> **SPEXT** é uma plataforma de **percepção visual** onde a unidade fundamental
> não é a imagem — é o **token de imagem**. Cada imagem que entra no sistema é
> convertida em uma representação tokenizada padronizada, e tudo o que vem
> depois (detecção, classificação, navegação, relatório, busca) são
> *operações sobre tokens*.
>
> A "inspeção" é só o primeiro caso de uso. O objetivo maior é uma
> infraestrutura acadêmica viva que **aprende à medida que é usada** e onde cada
> novo projeto (inclusive TCCs) pluga um **domínio** sem reescrever o núcleo.

---

## A ideia em uma frase

> **Automatizar o automatizado.** Sistemas que já agem por regras (um carro
> autônomo de competição, uma linha de inspeção) passam a consumir o SPEXT como
> camada de percepção adaptativa — e cada uso real vira dado que melhora o
> próximo modelo.

```text
uso → dados → modelo melhor → uso melhor → mais dados → ...
```

## Os três primeiros domínios

| Domínio | Input | Output (tokens viram) | Regime |
|---|---|---|---|
| **Baja** — inspeção de pintura | foto de chassi | relatório de defeito | batch / nuvem |
| **Soja** — classificação de grãos | foto de lote | decisão Premium/Expulso | batch / nuvem |
| **Carro SENAC** — direção autônoma | stream de câmera | comando de navegação | **tempo real / borda (Pi 5)** |

Os três rodam sobre o **mesmo core**. O que muda entre eles é o *vocabulário de
classes*, o *pipeline de tokenização* e *o que se faz com os tokens*.

## O contrato universal: o Token

Um defeito de pintura, um grão ardido e um obstáculo na pista são todos a mesma
coisa para o core:

```jsonc
Token {
  classe:      "soja_ardida",          // do vocabulário do domínio
  bbox:        [x1, y1, x2, y2],       // onde, em pixels
  confianca:   0.89,
  embedding:   [...],                  // representação vetorial (opcional)
  dominio:     "soja",
  semantica:   { decisao: "expulso" }  // regra de negócio do domínio
}
```

É a **tokenização** que faz Baja, Soja e Carro serem o mesmo sistema. Não é uma
feature — é a *interface*. Ver [`docs/03-contrato-de-token.md`](docs/03-contrato-de-token.md).

## Arquitetura em duas metades

```text
┌─────────── BORDA (Pi 5) — onde a ação acontece ───────────┐
│  câmera → SPEXT Runtime (modelo exportado, leve)          │
│            ↓ inferência local                              │
│         tokens → controlador (carro / operador)           │
│            ↓ buffer local                                 │
└──────────────────────┬────────────────────────────────────┘
                       │ sincroniza quando há rede
                       ↓
┌─────────── NUVEM — onde o aprendizado acontece ───────────┐
│  ingestão → dataset incremental → treino → registry       │
│                    ↑ feedback        ↓ exporta p/ borda   │
└────────────────────────────────────────────────────────────┘
```

Regra de ouro: **a borda nunca treina, só infere e coleta. A nuvem nunca infere
em tempo real, só treina e versiona.** Ver [`docs/02-arquitetura.md`](docs/02-arquitetura.md).

## Estado atual

- **Fase:** blueprint / arquitetura. Este repositório contém, por enquanto, a
  documentação que define o norte do projeto — ainda **sem código de
  aplicação**.
- **Hardware de borda disponível:** Raspberry Pi 5 (único por ora).
- **Modelos existentes:** Soja já tem modelos treinados (EfficientNet-B0,
  `.keras`) no Google Drive; Baja tem protótipo YOLO em modo demo. Ambos os
  **datasets e modelos seguem em melhoria progressiva** — por isso versionamento
  e learning loop são fundação, não fase futura. Ver
  [`docs/07-modelos-e-datasets.md`](docs/07-modelos-e-datasets.md).

## Documentação

| Doc | Assunto |
|---|---|
| [`01-visao-geral.md`](docs/01-visao-geral.md) | Problema, solução, público, o ângulo TCC |
| [`02-arquitetura.md`](docs/02-arquitetura.md) | Duas metades (borda/nuvem), três camadas do core |
| [`03-contrato-de-token.md`](docs/03-contrato-de-token.md) | O token como interface universal |
| [`04-dominios.md`](docs/04-dominios.md) | Domain Registry; Baja, Soja, Carro SENAC |
| [`05-borda-pi5.md`](docs/05-borda-pi5.md) | Runtime na borda, papel do ESP32, export de modelo |
| [`06-learning-loop.md`](docs/06-learning-loop.md) | Melhoria progressiva, versionamento, feedback |
| [`07-modelos-e-datasets.md`](docs/07-modelos-e-datasets.md) | Inventário do que já existe e onde |
| [`08-roadmap.md`](docs/08-roadmap.md) | Fases, competição SENAC, prazo 6 meses–2 anos |

Contexto para o Claude Code: [`CLAUDE.md`](CLAUDE.md).
