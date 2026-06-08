# CLAUDE.md — SPEXT

> Arquivo de contexto para o Claude Code. Leia tudo antes de gerar código.
> Resume o que o SPEXT é, as decisões já fechadas (com os porquês) e o que
> falta. Os detalhes longos estão em `docs/`.

---

## 1. O que é o SPEXT

Uma **plataforma acadêmica de visão computacional e tokenização de imagens**.
A unidade fundamental é o **token de imagem**, não a imagem. Toda imagem vira um
conjunto de `Token{classe, bbox, confiança, embedding, domínio, semântica}`, e
todo o resto são operações sobre tokens.

Frase-guia: **"automatizar o automatizado"** — sistemas que já agem por regras
passam a consumir o SPEXT como percepção adaptativa, e cada uso vira dado de
treino.

**NÃO é** (ainda):
- um SaaS comercial fechado;
- uma única API de YOLO;
- um sistema industrial com esteira/NIR/soprador (isso é horizonte distante).

É uma **base reutilizável** onde cada projeto pluga um **domínio**.

---

## 2. Os três primeiros domínios

| Domínio | Pipeline atual | Regime | Feedback |
|---|---|---|---|
| **Baja** (pintura) | YOLO (caixa nativa) | batch / nuvem | humano confirma |
| **Soja** (grãos) | OpenCV recorta → EfficientNet-B0 classifica | batch / nuvem | humano confirma lote |
| **Carro SENAC** (direção autônoma) | a definir (leve, real-time) | **tempo real / borda** | **automático** (desempenho do carro) |

Insight central: **Baja e Soja usam paradigmas diferentes** (detecção vs.
segmentação+classificação) e mesmo assim produzem o **mesmo token**. Por isso o
core precisa suportar **múltiplos tipos de pipeline atrás de um contrato único**,
nunca assumir "é tudo YOLO".

---

## 3. Stack / decisões — FECHADAS, não relitigar

| Tema | Decisão | Por quê |
|---|---|---|
| Contrato central | **Token** (ver `docs/03`) | Unifica domínios e as duas metades do sistema |
| Borda | **Raspberry Pi 5** (único hardware hoje) | Roda EfficientNet-B0 / YOLO pequeno via TFLite/ONNX dentro de <100ms |
| ESP32 | **Sensor/atuador, NÃO inferência** | 29 MB de modelo não cabe em ~520 KB de RAM; ESP32-CAM captura, Pi infere, ESP32 aciona motor |
| Treino | **Nuvem** (Colab/GPU), nunca na borda | Borda só infere e coleta |
| Modelo Soja | **EfficientNet-B0 (Keras)** já treinado | É o que existe e funciona; o `data.yaml` YOLO do repo Soja era aspiracional |
| Modelo Baja | **YOLO (Ultralytics)** em modo demo | Protótipo existente |
| Versionamento | **Model Registry + datasets versionados desde já** | Dataset e modelos melhoram progressivamente — é fundação, não fase futura |
| Deploy nuvem | **HF Spaces + Vercel** (herdado dos repos) | O dono já usa |

---

## 4. Regra de ouro da arquitetura

> **A borda nunca treina, só infere e coleta. A nuvem nunca infere em tempo
> real, só treina e versiona.** O ponto de contato entre as duas é um arquivo
> de pesos (nuvem → borda) e um stream de dados de feedback (borda → nuvem).

Detalhe em `docs/02-arquitetura.md` e `docs/06-learning-loop.md`.

---

## 5. Estado atual

- Repositório contém **apenas documentação** (blueprint). Sem código de
  aplicação ainda.
- Modelos da Soja treinados e no Google Drive (`.keras`, ver `docs/07`).
- Baja: protótipo YOLO demo no repo `Gustavo-dev04/Baja`.
- Soja: código no repo `Gustavo-dev04/soja-inspectio-`, branch
  `claude/soja-inspection-setup-b2jaG`.
- Prazo do projeto: **6 meses a 2 anos**. Primeiro marco prático: competição de
  carros autônomos de brinquedo no SENAC.

---

## 6. Próximos passos sugeridos (não começar sem alinhar)

1. Definir a estrutura de pastas do monorepo (`core/`, `domains/`, `edge/`,
   `cloud/`).
2. Especificar o **schema do Token** em código (Pydantic) — é o primeiro
   contrato a existir.
3. Portar Baja e Soja para o formato de **domínio plugável**.
4. Provar o runtime de borda no Pi 5 com um modelo exportado.

---

## 7. Repositórios relacionados

- `Gustavo-dev04/Baja` — inspeção de pintura (YOLO + FastAPI + Next.js).
- `Gustavo-dev04/soja-inspectio-` — inspeção de soja (EfficientNet + FastAPI +
  Next.js + Supabase).
- `Gustavo-dev04/SPEXT` — este repo, a plataforma que generaliza os dois.
