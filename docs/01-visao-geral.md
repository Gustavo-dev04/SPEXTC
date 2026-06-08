# 01 — Visão Geral

## Problema

Projetos de visão computacional aplicada — inspeção de pintura, classificação de
grãos, navegação autônoma — hoje são construídos do zero, cada um com seu
backend, seu frontend, seu modelo e seu deploy. O conhecimento não se acumula: o
segundo projeto não aproveita quase nada do primeiro, e cada TCC recomeça a
mesma infraestrutura.

Além disso, esses sistemas geralmente são **estáticos**: o modelo é treinado uma
vez e congelado. O uso real gera toneladas de dados valiosos que simplesmente se
perdem, em vez de realimentar o modelo.

## Solução proposta

O **SPEXT** é uma plataforma de **percepção visual** com três propriedades:

1. **Tokenização como interface.** Toda imagem vira um conjunto padronizado de
   tokens. Detecção, classificação, navegação e relatório passam a ser
   operações sobre tokens, independentes do domínio.
2. **Domínios plugáveis.** Cada caso de uso (pintura, soja, carro, qualquer TCC)
   é um *domínio* registrado: vocabulário + pipeline + regras. O núcleo nunca
   muda.
3. **Aprendizado contínuo.** Cada inferência feita em produção pode virar
   amostra de treino. O sistema **melhora à medida que é usado**.

## "Automatizar o automatizado"

O caso mais ilustrativo é o **carro autônomo de brinquedo** (competição SENAC).
O carro já é autônomo por regras hardcoded. O SPEXT entra como **camada de
percepção adaptativa**: em vez de `se pixel vermelho → para`, o carro recebe
tokens com semântica (`obstáculo à esquerda, 30 cm, confiança 0.89`) e o
resultado de cada ação (bateu? passou? tempo de volta?) vira **ground truth
implícito** que treina o próximo modelo — sem anotação humana para tudo.

A inspeção (Baja, Soja) é o mesmo padrão, só que o "agente que age" é um humano
confirmando o resultado.

## Objetivos

### Geral

Construir uma plataforma reutilizável de visão computacional onde novos domínios
entram sem reescrever o núcleo, e onde o uso real realimenta o treino.

### Específicos

1. Definir o **contrato de Token** que unifica todos os domínios.
2. Suportar **múltiplos tipos de pipeline** (detecção YOLO, segmentação+classificação)
   atrás do mesmo contrato.
3. Entregar um **runtime de borda** que roda no Raspberry Pi 5 em tempo real.
4. Implementar o **learning loop**: coleta → versionamento → retreino → re-deploy.
5. Provar a plataforma com **três domínios** distintos (pintura, soja, carro).

## Público-alvo

- **Equipes de competição** (carros autônomos, BAJA SAE).
- **Empresas** que precisam de inspeção visual (soja e além).
- **Estudantes de TCC** em IA/visão computacional — que plugam o domínio deles e,
  ao fazê-lo, melhoram a plataforma para todos.
- **Grupos de pesquisa** em visão computacional industrial e tokenização visual.

## O ângulo TCC é estratégico

Se cada aluno com TCC de IA pode plugar o domínio dele (contar parafusos,
reconhecer plantas, triar produtos) e consumir tudo via a mesma API, o SPEXT vira
uma **infraestrutura acadêmica viva**: cada TCC que entra melhora a plataforma, e
a plataforma acelera cada TCC. É um flywheel acadêmico, não só técnico.

## Justificativa científica

- **Tokenização visual** é uma das linhas mais ativas em visão computacional
  (ViT, VQ-VAE/VQ-GAN, modelos multimodais). Tratar percepção como geração e
  consumo de tokens é um substrato moderno e pouco explorado em trabalhos
  acadêmicos brasileiros aplicados.
- **Aprendizado contínuo / online** com feedback de operação fechada (o carro
  como sinal de treino) é um problema de pesquisa real e rende publicação.
- A **destilação** de modelos grandes (EfficientNet/YOLO) para caber em hardware
  restrito (Pi 5 hoje, ESP32 amanhã) é, por si só, um TCC inteiro.
