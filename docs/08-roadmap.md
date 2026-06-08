# 08 — Roadmap

Horizonte do projeto: **6 meses a 2 anos**. Primeiro marco prático: competição de
carros autônomos de brinquedo no **SENAC**. O roadmap prioriza provar a
plataforma com pouco hardware (só Pi 5) e ir abrindo as linhas de pesquisa/TCC.

## Fase 0 — Blueprint ✅ (agora)

- Visão, arquitetura de duas metades, contrato de token, domínios, borda e
  learning loop documentados neste repositório.
- Inventário dos modelos/datasets existentes.

## Fase 1 — Fundação do core

- Schema do **Token / TokenSet** em código (Pydantic) — o primeiro contrato.
- Estrutura do monorepo (`core/`, `domains/`, `edge/`, `cloud/`).
- **Domain Registry** mínimo (carregar um domínio declarativo).
- **Registro versionado** de dataset e modelo (mesmo que simples) — porque a
  melhoria é progressiva desde o início.

## Fase 2 — Portar os domínios existentes

- **Soja** como domínio plugável: pipeline OpenCV + EfficientNet-B0, usando os
  `.keras` já treinados → produzir `TokenSet`.
- **Baja** como domínio plugável: pipeline YOLO (modo demo) → produzir `TokenSet`.
- Um frontend único que desenha overlay para qualquer domínio a partir do
  `TokenSet`.

## Fase 3 — Borda no Pi 5

- Export Keras→TFLite e YOLO→ONNX, quantizados.
- **SPEXT Runtime** no Pi 5: modelo exportado → inferência local → `TokenSet` →
  buffer local resiliente a offline.
- Marco: caminho completo de inferência rodando no Pi sem depender de rede.

## Fase 4 — Domínio Carro SENAC

- Definir vocabulário (faixa/obstáculo/cone/...) e pipeline leve real-time.
- Integração borda: ESP32-CAM capta → Pi infere → atuador aciona (quando houver
  ESP32; até lá, câmera direta no Pi).
- Fechar o **feedback automático**: desempenho do carro → amostra de treino.

## Fase 5 — Learning Loop completo

- Ingestão do buffer da borda na nuvem.
- Retreino agendado a partir do dataset incremental versionado.
- Avaliação + promoção (A/B) + re-export para a borda.
- Demonstrar uma volta completa do flywheel: uso → dado → modelo melhor → uso.

## Fase 6 — Plataforma acadêmica / TCCs

- Onboarding de **novos domínios por terceiros** (alunos de TCC).
- API REST documentada + dashboard multi-domínio + histórico.
- Deploy: HF Spaces (modelos) + Vercel (frontend), herdado dos repos.

## Linhas de pesquisa / TCC (paralelas, não bloqueiam o caminho crítico)

- **Tokenização avançada:** subir do nível "tokens de objeto" para patches (ViT)
  ou tokens discretos (VQ-VAE) — ver [`03-contrato-de-token.md`](03-contrato-de-token.md).
- **Model compression:** destilar EfficientNet/YOLO para caber em **ESP32**
  (de 29 MB para < 1 MB) — quantização, pruning, knowledge distillation.
- **Aprendizado contínuo:** feedback de operação fechada (o carro como sinal de
  treino) como objeto de estudo e publicação.
- **NIR / multiespectral** (horizonte distante, herdado da visão da Soja):
  detectar defeitos internos invisíveis ao RGB.

## Princípios que guiam a priorização

1. **Provar com o que existe** — Pi 5 e modelos já treinados antes de comprar
   hardware novo.
2. **Contrato antes de feature** — o Token vem antes de qualquer pipeline.
3. **Versionar desde o dia 1** — porque tudo melhora progressivamente.
4. **Cada TCC fortalece a base** — não é trabalho jogado fora; é flywheel.
