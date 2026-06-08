# 04 — Domínios

Um **domínio** é a unidade de extensão do SPEXT. É o que um novo projeto (ou TCC)
adiciona para usar a plataforma, sem tocar no núcleo.

## Anatomia de um domínio

```text
Domínio = {
  nome:            "soja",
  vocabulario:     [ classes do domínio ],
  pipeline:        qual tokenizador usar (detecção / seg+classif / ...),
  modelo:          referência versionada ao peso atual,
  thresholds:      confiança mínima por classe,
  regras:          como traduzir tokens em decisão de negócio,
  feedback:        como o domínio coleta sinal de treino
}
```

O core lê esse registro e sabe processar qualquer imagem do domínio. Adicionar um
domínio é **declarativo**, não exige reescrever o Perception Core.

---

## Domínio 1 — Baja (inspeção de pintura)

- **Origem:** `Gustavo-dev04/Baja`.
- **Vocabulário (6):** `escorrimento`, `casca_de_laranja`, `falha_cobertura`,
  `bolha`, `risco`, `oxidacao`.
- **Pipeline:** **detecção** (YOLO/Ultralytics) — a rede devolve caixas direto.
- **Estado:** protótipo em **modo demo** — usa `yolov8n.pt` (COCO) com mapeamento
  de classes genéricas para defeitos enquanto o pipeline end-to-end é validado.
  Flag `demo_mode: true` sinaliza isso.
- **Regras de negócio:** relatório de defeitos por imagem; sem decisão
  automática de descarte (operador humano decide).
- **Feedback:** humano confirma/corrige as detecções.

## Domínio 2 — Soja (classificação de grãos)

- **Origem:** `Gustavo-dev04/soja-inspectio-` (branch
  `claude/soja-inspection-setup-b2jaG`).
- **Vocabulário (5):** `Broken`, `Immature`, `Intact`, `Skin-damaged`,
  `Spotted` (rótulos do dataset). Na camada de negócio mapeiam para
  Premium / Matéria-prima / Expulso.
- **Pipeline:** **segmentação + classificação** — OpenCV recorta cada grão (fundo
  escuro torna o threshold trivial), e o **EfficientNet-B0 (Keras)** classifica
  cada recorte. A caixa vem do recorte do OpenCV.
- **Estado:** **modelo treinado e funcionando** (`.keras`, ~29 MB), no Google
  Drive. Há versões `phase1`, `phase2`, `final`, `finetuned`. Ver
  [`07-modelos-e-datasets.md`](07-modelos-e-datasets.md).
- **Regras de negócio:** thresholds por classe; `soja_ardida` com tolerância
  zero (risco alimentar); decisão Premium/Matéria-prima/Expulso por grão.
- **Feedback:** humano confirma o lote.

> **Nota importante.** O modelo real da Soja é o **EfficientNet-B0 de
> classificação** (caminho do `CLAUDE.md` do repo Soja), **não** o YOLO do
> `ESPECIFICACAO.md` — o `data.yaml` YOLO nunca virou peso treinado. O SPEXT
> adota o que existe e funciona. Esse é o exemplo vivo de por que o core precisa
> suportar o pipeline de **segmentação+classificação**, e não só detecção.

## Domínio 3 — Carro SENAC (direção autônoma)

- **Origem:** novo (competição de carros de brinquedo autônomos no SENAC).
- **Vocabulário:** a definir — provavelmente elementos de pista (faixa,
  obstáculo, cone, linha de chegada) e/ou comandos.
- **Pipeline:** a definir — precisa ser **leve e tempo real** no Pi 5 (< 100 ms).
  Candidatos: YOLO nano, ou um modelo de navegação dedicado.
- **Estado:** conceitual.
- **Regras de negócio:** tokens viram **comando de navegação**.
- **Feedback:** **automático** — o desempenho do carro (bateu? completou a
  volta? tempo?) é ground truth implícito. É o domínio que mais exercita o
  learning loop sem anotação humana.

---

## Comparativo

| | Baja | Soja | Carro SENAC |
|---|---|---|---|
| Pipeline | detecção | seg + classificação | leve real-time (a definir) |
| Runtime | nuvem (batch) | nuvem (batch) | **borda Pi 5** |
| Tokens viram | relatório | decisão Premium/Expulso | comando de navegação |
| Feedback | humano | humano (lote) | **automático** |
| Mesma engine? | ✅ | ✅ | ✅ |

Os três juntos exercitam a plataforma inteira: o carro valida a **borda** e o
**feedback automático**; soja/baja validam o **loop de feedback humano** e os
**dois paradigmas de pipeline**.

---

## Como um TCC vira um domínio

1. Define o vocabulário de classes do problema.
2. Escolhe um pipeline existente (detecção ou seg+classificação) — ou propõe um
   novo (isso já é contribuição de pesquisa).
3. Traz/coleta o dataset (versionado na nuvem).
4. Treina pela infraestrutura do SPEXT; o modelo entra no registry versionado.
5. Registra o domínio. A partir daí, upload, overlay, histórico, API e learning
   loop funcionam de graça.
