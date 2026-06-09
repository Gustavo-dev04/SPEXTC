"""Gerador do documento de contexto do SPEXTc em PDF."""

from __future__ import annotations

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

PAGE_W, PAGE_H = A4
MARGIN = 2.2 * cm

DARK = colors.HexColor("#1a1a2e")
ACCENT = colors.HexColor("#4f8ef7")
LIGHT_BG = colors.HexColor("#f0f4ff")
MUTED = colors.HexColor("#6b7280")
GREEN = colors.HexColor("#16a34a")
RED = colors.HexColor("#dc2626")
ORANGE = colors.HexColor("#d97706")

styles = getSampleStyleSheet()

H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=22, leading=28,
                    textColor=DARK, spaceAfter=6, spaceBefore=18,
                    fontName="Helvetica-Bold")
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14, leading=18,
                    textColor=ACCENT, spaceAfter=4, spaceBefore=14,
                    fontName="Helvetica-Bold")
H3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=11, leading=15,
                    textColor=DARK, spaceAfter=3, spaceBefore=8,
                    fontName="Helvetica-Bold")
BODY = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=15,
                      textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=6,
                      fontName="Helvetica")
BODY_L = ParagraphStyle("BodyL", parent=BODY, alignment=TA_LEFT)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=9, textColor=MUTED,
                       alignment=TA_CENTER)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=14, bulletIndent=0,
                        spaceBefore=1, spaceAfter=1)
CODE = ParagraphStyle("Code", parent=styles["Normal"], fontSize=9, leading=13,
                      textColor=DARK, fontName="Courier",
                      backColor=colors.HexColor("#f5f5f5"),
                      leftIndent=12, rightIndent=12, spaceBefore=4, spaceAfter=4)
RULE = ParagraphStyle("Rule", parent=BODY, textColor=ACCENT, fontSize=11,
                      leading=16, alignment=TA_CENTER, spaceBefore=8, spaceAfter=8,
                      fontName="Helvetica-BoldOblique")
COVER_TITLE = ParagraphStyle("CoverTitle", fontSize=36, leading=42,
                              textColor=colors.white, alignment=TA_CENTER,
                              fontName="Helvetica-Bold", spaceAfter=6)
COVER_SUB = ParagraphStyle("CoverSub", fontSize=16, leading=22,
                            textColor=colors.HexColor("#c7d9ff"),
                            alignment=TA_CENTER, fontName="Helvetica")
COVER_META = ParagraphStyle("CoverMeta", fontSize=10, leading=14,
                             textColor=colors.HexColor("#93b8ff"),
                             alignment=TA_CENTER, fontName="Helvetica")


def sep() -> list:
    return [Spacer(1, 0.3 * cm),
            HRFlowable(width="100%", thickness=0.5, color=LIGHT_BG),
            Spacer(1, 0.3 * cm)]


def b(text: str) -> str:
    return f"<b>{text}</b>"


def i(text: str) -> str:
    return f"<i>{text}</i>"


def colored(text: str, c: colors.Color) -> str:
    return f'<font color="{c.hexval()}">{text}</font>'


def table(data: list[list], col_widths=None, header_row=True) -> Table:
    t = Table(data, colWidths=col_widths, repeatRows=1 if header_row else 0)
    base = [
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]
    t.setStyle(TableStyle(base))
    return t


def cover_page() -> list:
    W = PAGE_W - 2 * MARGIN
    cover_bg = Table(
        [[Paragraph("SPEXTc", COVER_TITLE)],
         [Paragraph("Plataforma Acadêmica de Visão Computacional<br/>e Tokenização de Imagens", COVER_SUB)],
         [Spacer(1, 0.6 * cm)],
         [Paragraph("Documento de Contexto Completo", COVER_META)],
         [Paragraph("Gustavo Barros · FATEC · 2026", COVER_META)],
         [Paragraph("Horizonte: 6 meses – 2 anos", COVER_META)]],
        colWidths=[W]
    )
    cover_bg.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK),
        ("TOPPADDING", (0, 0), (-1, -1), 18),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
        ("LEFTPADDING", (0, 0), (-1, -1), 24),
        ("RIGHTPADDING", (0, 0), (-1, -1), 24),
        ("ROUNDEDCORNERS", [8]),
    ]))
    return [
        Spacer(1, 2 * cm),
        cover_bg,
        Spacer(1, 1 * cm),
        Paragraph(
            "Este documento resume a visão, a arquitetura, as decisões fechadas, "
            "o inventário de modelos e o roadmap do projeto <b>SPEXTc</b>. "
            "Serve como referência completa de contexto para colaboradores, "
            "orientadores e alunos de TCC.",
            BODY,
        ),
        PageBreak(),
    ]


def section_visao() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("1. O que é o SPEXTc", H1),
        Paragraph(
            "O <b>SPEXTc</b> é uma <b>plataforma acadêmica de percepção visual</b> "
            "onde a unidade fundamental não é a imagem — é o <b>token de imagem</b>. "
            "Toda imagem que entra no sistema é convertida em um conjunto padronizado "
            "de tokens, e tudo o que vem depois (detecção, classificação, navegação, "
            "relatório, busca) são <i>operações sobre tokens</i>.",
            BODY,
        ),
        Spacer(1, 0.2 * cm),
        Table(
            [["FRASE-GUIA"]],
            colWidths=[W]
        ),
    ]
    elems[-1].setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e0e7ff")),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    elems.append(
        Table(
            [[Paragraph(
                '"<b>Automatizar o automatizado.</b> Sistemas que já agem por regras '
                'passam a consumir o SPEXTc como camada de percepção adaptativa — '
                'e cada uso real vira dado que melhora o próximo modelo."',
                RULE,
            )]],
            colWidths=[W]
        )
    )
    elems[-1].setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e0e7ff")),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
    ]))
    elems += [
        Spacer(1, 0.4 * cm),
        Paragraph("O SPEXTc <b>NÃO é</b> (ainda):", H3),
        Paragraph("• Um SaaS comercial fechado.", BULLET),
        Paragraph("• Uma única API de YOLO.", BULLET),
        Paragraph("• Um sistema industrial com esteira/NIR/soprador.", BULLET),
        Spacer(1, 0.2 * cm),
        Paragraph(
            "É uma <b>base reutilizável</b> onde cada projeto pluga um <b>domínio</b> "
            "(vocabulário + pipeline + regras de negócio) sem reescrever o núcleo. "
            "Cada TCC que entra melhora a plataforma para todos — um flywheel acadêmico.",
            BODY,
        ),
        Paragraph("Flywheel de aprendizado", H3),
        Paragraph(
            '<font name="Courier" size="10">uso → dados → modelo melhor → uso melhor → mais dados → ...</font>',
            CODE,
        ),
        Paragraph(
            "O carro autônomo de brinquedo (competição SENAC) é o caso mais "
            "ilustrativo: o próprio desempenho do carro (bateu? completou a volta?) "
            "é <b>ground truth implícito</b> que retreina o modelo — sem anotação "
            "humana para tudo.",
            BODY,
        ),
    ]
    return elems + sep()


def section_dominios() -> list:
    elems = [Paragraph("2. Os três primeiros domínios", H1)]
    elems.append(Paragraph(
        "Insight central: <b>Baja e Soja usam paradigmas opostos</b> (detecção vs. "
        "segmentação+classificação) e mesmo assim produzem o <b>mesmo TokenSet</b>. "
        "Isso prova que o core precisa suportar múltiplos pipelines atrás de um "
        "contrato único — nunca assumir 'é tudo YOLO'.",
        BODY,
    ))
    elems.append(Spacer(1, 0.3 * cm))
    W = PAGE_W - 2 * MARGIN
    data = [
        ["Domínio", "Pipeline", "Regime", "Feedback", "Estado"],
        ["Baja\n(pintura)", "YOLO\n(detecção nativa)", "Batch / nuvem",
         "Humano confirma", "Protótipo demo\n(pesos COCO)"],
        ["Soja\n(grãos)", "OpenCV recorta\n→ EfficientNet-B0", "Batch / nuvem",
         "Humano confirma\nlote", "Modelos treinados\n(Drive, .keras)"],
        ["Carro SENAC\n(autônomo)", "Leve, real-time\n(a definir)", "Borda\nPi 5, < 100 ms",
         "Automático\n(desempenho)", "Rascunho"],
    ]
    col_w = [W * f for f in [0.16, 0.22, 0.16, 0.22, 0.24]]
    t = table(data, col_widths=col_w)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    elems.append(t)

    elems += [
        Spacer(1, 0.4 * cm),
        Paragraph("Como um TCC vira um domínio", H3),
        Paragraph(
            "1. Define o vocabulário de classes. "
            "2. Escolhe um pipeline existente (ou propõe um novo — isso já é contribuição). "
            "3. Traz o dataset versionado. "
            "4. Treina pela infraestrutura do SPEXTc; modelo entra no registry. "
            "5. Registra o domínio. Upload, overlay, histórico, API e learning loop "
            "funcionam de graça.",
            BODY,
        ),
    ]
    return elems + sep()


def section_arquitetura() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("3. Arquitetura — duas metades", H1),
        Paragraph(
            "A divisão em duas metades resolve a tensão entre domínios em batch "
            "(Soja/Baja — precisão importa, latência não) e o domínio em tempo real "
            "(Carro SENAC — latência &lt; 100 ms é lei).",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
    ]
    borda = Table(
        [[Paragraph(b("BORDA — Raspberry Pi 5"), BODY_L)],
         [Paragraph("câmera → SPEXT Runtime (modelo exportado, leve)", CODE)],
         [Paragraph("↓ inferência local &lt; 100 ms", CODE)],
         [Paragraph("tokens → controlador (carro / operador)", CODE)],
         [Paragraph("↓ buffer local (frames + resultado da ação)", CODE)]],
        colWidths=[W * 0.46]
    )
    borda.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e0f2fe")),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 1, ACCENT),
    ]))
    nuvem = Table(
        [[Paragraph(b("NUVEM — onde o aprendizado acontece"), BODY_L)],
         [Paragraph("ingestão → dataset incremental → treino", CODE)],
         [Paragraph("↓ avaliação + Model Registry versionado", CODE)],
         [Paragraph("↓ export para borda (TFLite / ONNX)", CODE)],
         [Paragraph("← feedback (borda → nuvem via sync)", CODE)]],
        colWidths=[W * 0.46]
    )
    nuvem.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 1, GREEN),
    ]))
    arrow = Table([[Paragraph("⟷\nsincroniza\nquando há\nrede", SMALL)]],
                  colWidths=[W * 0.08])
    arrow.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    two_col = Table([[borda, arrow, nuvem]], colWidths=[W * 0.46, W * 0.08, W * 0.46])
    two_col.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    elems.append(two_col)
    elems += [
        Spacer(1, 0.4 * cm),
        Paragraph("Regra de ouro (nunca violar):", H3),
        Paragraph(
            '<font name="Courier" size="10">'
            "A borda nunca treina, só infere e coleta.<br/>"
            "A nuvem nunca infere em tempo real, só treina e versiona."
            "</font>",
            CODE,
        ),
        Paragraph("As três camadas do core", H3),
    ]
    data = [
        ["Camada", "Responsabilidade", "Estado"],
        ["1. Perception Core", "imagem → tokens (agnóstico de domínio)", "Código na Fase 1 ✅"],
        ["2. Domain Registry", "vocabulário + pipeline + regras por domínio", "Código na Fase 1 ✅"],
        ["3. Learning Loop", "coleta → retreino → versiona → re-deploy", "Esqueleto (Fase 5)"],
    ]
    col_w = [W * 0.22, W * 0.52, W * 0.26]
    elems.append(table(data, col_widths=col_w))
    return elems + sep()


def section_token() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("4. O contrato de Token", H1),
        Paragraph(
            "O <b>Token</b> é a interface do SPEXTc. Não é uma feature — é o que "
            "faz Baja, Soja e Carro serem o mesmo sistema. Um defeito de pintura, "
            "um grão ardido e um obstáculo na pista são todos:",
            BODY,
        ),
        Paragraph(
            'Token { classe, dominio, bbox[x1,y1,x2,y2], confianca,\n'
            '        mask?, embedding?, semantica{decisao, ...} }',
            CODE,
        ),
        Paragraph(
            "O agregado de uma imagem é o <b>TokenSet</b>, que carrega a "
            "<b>versão exata do modelo</b> que o gerou — essencial para "
            "rastreabilidade e reprodutibilidade científica.",
            BODY,
        ),
        Spacer(1, 0.2 * cm),
        Paragraph("Pipelines de tokenização aceitos pelo core:", H3),
    ]
    data = [
        ["Pipeline", "Como tokeniza", "Quem usa hoje"],
        ["Detecção\n(YOLO/RT-DETR)", "Rede devolve caixas + classe diretamente", "Baja ✅"],
        ["Seg + Classificação\n(OpenCV + EfficientNet)", "OpenCV recorta cada objeto →\nclassificador rotula → bbox vem do recorte", "Soja ✅"],
        ["Patch/Embedding (ViT)", "Imagem fatiada em patches → embeddings", "Futuro / TCC"],
        ["Codebook discreto\n(VQ-VAE)", "Vocabulário visual aprendido", "Futuro / pesquisa"],
    ]
    col_w = [W * 0.24, W * 0.44, W * 0.32]
    elems.append(table(data, col_widths=col_w))
    elems += [
        Spacer(1, 0.3 * cm),
        Paragraph(
            "A plataforma começa em <b>Nível 1 (tokens de objeto)</b> — já viável "
            "com Baja e Soja — sem fechar a porta para Nível 2 (patches ViT) ou "
            "Nível 3 (tokens discretos), linhas de pesquisa futuras.",
            BODY,
        ),
    ]
    return elems + sep()


def section_borda() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("5. Borda — Raspberry Pi 5", H1),
        Paragraph(
            "Hardware de borda disponível hoje: <b>apenas o Raspberry Pi 5</b>. "
            "É o cérebro de inferência local do domínio Carro SENAC.",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
    ]
    data = [
        ["Modelo", "Cabe no Pi 5?", "Observação"],
        ["EfficientNet-B0\n(29 MB, Keras→TFLite)", "✅ Sim", "Poucos a dezenas de FPS conforme quantização"],
        ["YOLO nano (ONNX/TFLite)", "✅ Sim", "Viável para detecção leve em tempo real"],
        ["RT-DETR / modelos grandes", "⚠️ Marginal", "Só com folga de latência; não recomendado para o carro"],
        ["EfficientNet-B0 no ESP32", "❌ Não", "29 MB; ESP32 tem ~520 KB RAM. Não cabe."],
    ]
    col_w = [W * 0.28, W * 0.15, W * 0.57]
    t = table(data, col_widths=col_w)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("BACKGROUND", (0, 4), (-1, 4), colors.HexColor("#fff1f2")),
    ]))
    elems.append(t)
    elems += [
        Spacer(1, 0.3 * cm),
        Paragraph("Papel de cada peça (arquitetura típica de competição):", H3),
        Paragraph(
            '<font name="Courier" size="9">'
            "ESP32-CAM → captura frame<br/>"
            "         ↓ (USB / WiFi local)<br/>"
            "Raspberry Pi 5 → inferência (SPEXT Runtime) → token → decisão<br/>"
            "         ↓<br/>"
            "ESP32 / driver → aciona motor / direção"
            "</font>",
            CODE,
        ),
        Paragraph(
            "Enquanto não há ESP32 em mãos, a câmera conecta direto ao Pi. "
            "Quando o ESP32 chegar, entra como olho (captura) e mão (atuação) — "
            "o Pi continua sendo o cérebro.",
            BODY,
        ),
        Paragraph(
            "<b>Linha de pesquisa / TCC:</b> destilar um modelo pequeno o suficiente "
            "para rodar no ESP32 (de 29 MB para &lt; 1 MB via quantização, pruning e "
            "knowledge distillation) é um TCC inteiro de model compression.",
            BODY,
        ),
    ]
    return elems + sep()


def section_learning_loop() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("6. Learning Loop — melhoria progressiva", H1),
        Paragraph(
            "Dataset e modelos <b>melhoram progressivamente</b> — por decisão "
            "explícita do dono do projeto. Isso é <b>fundação, não fase futura</b>. "
            "Versionamento e rastreabilidade existem desde o primeiro commit.",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
        Paragraph("O loop completo:", H3),
        Paragraph(
            '<font name="Courier" size="9">'
            "Inferência em produção<br/>"
            "   ↓ sinal de qualidade<br/>"
            "   ├── automático: desempenho do carro → amostra auto-rotulada<br/>"
            "   └── humano: confirma/corrige → amostra revisada<br/>"
            "   ↓<br/>"
            "Dataset incremental versionado<br/>"
            "   ↓ retreino agendado<br/>"
            "Avaliação vs. modelo atual<br/>"
            "   ├── melhor → Model Registry (nova versão) → A/B → deploy → re-export<br/>"
            "   └── pior  → descarta candidato"
            "</font>",
            CODE,
        ),
        Spacer(1, 0.3 * cm),
        Paragraph("As duas fontes de feedback:", H3),
    ]
    data = [
        ["Fonte", "Domínios", "Como funciona"],
        ["Humano", "Baja, Soja", "Operador confirma ou corrige os tokens;\ncorreções viram rótulos de alta qualidade."],
        ["Automático", "Carro SENAC", "Resultado da ação (bateu/completou volta/tempo)\né ground truth implícito — sem anotação manual."],
    ]
    col_w = [W * 0.15, W * 0.2, W * 0.65]
    elems.append(table(data, col_widths=col_w))
    elems += [
        Spacer(1, 0.3 * cm),
        Paragraph("O que é versionado desde o dia 1:", H3),
        Paragraph(
            "• <b>Datasets:</b> cada versão é imutável e identificável "
            "(ex.: <font name='Courier'>soja-ds@2026.06</font>). "
            "Novas amostras entram como incremento, nunca sobrescrevendo.",
            BULLET,
        ),
        Paragraph(
            "• <b>Modelos (Model Registry):</b> cada peso carrega metadados "
            "(dataset de origem, hiperparâmetros, métricas, data). "
            "O <font name='Courier'>TokenSet</font> carrega a versão exata "
            "que o gerou — qualquer resultado é reprodutível.",
            BULLET,
        ),
        Paragraph(
            "• <b>Regra de promoção:</b> nunca troca às cegas. Candidato só "
            "substitui o modelo de produção se for melhor nas métricas que "
            "importam ao domínio.",
            BULLET,
        ),
    ]
    return elems + sep()


def section_modelos() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("7. Inventário de modelos e datasets", H1),
        Paragraph(
            "Retrato do que já existe e funciona. A fonte da verdade será o "
            "Model Registry quando o código estiver completo.",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
        Paragraph("Modelos da Soja — Google Drive (todos EfficientNet-B0, .keras):", H3),
    ]
    data = [
        ["Arquivo", "Tamanho", "Papel"],
        ["soja_phase1_best.keras", "~17 MB", "Transfer learning inicial"],
        ["soja_phase2_best.keras", "~29 MB", "Melhor da fase 2 (fine-tuning)"],
        ["soja_model_final.keras", "~29 MB", "Modelo final"],
        ["soja_finetuned_best.keras", "~29 MB", "Melhor do fine-tuning com fotos próprias"],
        ["soja_finetuned_final.keras", "~29 MB", "Fine-tuned final (em uso)"],
    ]
    col_w = [W * 0.48, W * 0.14, W * 0.38]
    elems.append(table(data, col_widths=col_w))
    elems += [
        Spacer(1, 0.3 * cm),
        Paragraph("Dataset da Soja:", H3),
        Paragraph(
            "SoyaBeans Classifications v2 (Roboflow, MIT). "
            "~12.528 imagens, 400×400 px → resize 224×224. "
            "5 classes: Broken · Immature · Intact · Skin-damaged · Spotted. "
            "Splits: train/valid/test. "
            "<b>Evolução prevista:</b> coleta própria (fotos de celular, fundo escuro) "
            "para mitigar domain shift + fine-tuning progressivo.",
            BODY,
        ),
        Paragraph("Modelo e dataset da Baja:", H3),
        Paragraph(
            "<b>Modelo atual:</b> yolov8n.pt (COCO) em modo demo — sem fine-tune "
            "com defeitos reais ainda. <b>Dataset:</b> a construir "
            "(meta 500–1000 imagens de chassis pintados, rotulação Roboflow/CVAT, "
            "formato YOLO txt). Em construção progressiva.",
            BODY,
        ),
        Spacer(1, 0.2 * cm),
        Paragraph("Os dois paradigmas lado a lado:", H3),
    ]
    data2 = [
        ["", "Baja", "Soja"],
        ["Pipeline", "Detecção (YOLO)", "Segmentação OpenCV + Classificação EfficientNet"],
        ["Caixa vem de", "A própria rede", "Recorte do OpenCV"],
        ["Formato do peso", ".pt (Ultralytics)", ".keras (TensorFlow/Keras)"],
        ["Export para borda", "ONNX", "TFLite"],
        ["Estado", "Demo (sem fine-tune)", "Treinado e funcionando ✅"],
    ]
    col_w = [W * 0.22, W * 0.26, W * 0.52]
    t = table(data2, col_widths=col_w, header_row=False)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#374151")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f3f4f6")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    elems.append(t)
    return elems + sep()


def section_decisoes() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("8. Decisões fechadas — não relitigar", H1),
        Paragraph(
            "Estas decisões foram tomadas com contexto, têm razões documentadas "
            "e <b>não devem ser reabertas</b> sem justificativa forte.",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
    ]
    data = [
        ["Tema", "Decisão", "Por quê"],
        ["Contrato central", "Token / TokenSet", "Unifica domínios e as duas metades. Interface, não feature."],
        ["Hardware de borda", "Raspberry Pi 5\n(único hoje)", "Roda EfficientNet-B0 / YOLO nano via TFLite/ONNX < 100 ms."],
        ["ESP32", "Sensor/atuador,\nNÃO inferência", "29 MB de modelo não cabe em 520 KB RAM. ESP32-CAM captura, Pi infere."],
        ["Treino", "Nuvem (Colab/GPU),\nnunca na borda", "Borda só infere e coleta. Regra de ouro."],
        ["Modelo Soja", "EfficientNet-B0\n(Keras) já treinado", "É o que existe e funciona. O data.yaml YOLO era aspiracional."],
        ["Modelo Baja", "YOLO (Ultralytics)\nem modo demo", "Protótipo existente. Fine-tune após coletar dataset."],
        ["Versionamento", "Model Registry +\ndatasets versionados\ndesde já", "Melhoria é progressiva — é fundação, não fase futura."],
        ["Deploy nuvem", "HF Spaces + Vercel", "O dono já usa. Evitar retrabalho de infraestrutura."],
        ["Core", "Múltiplos pipelines\natrás do mesmo contrato", "Baja (detecção) e Soja (seg+classif) provam que é necessário."],
    ]
    col_w = [W * 0.2, W * 0.24, W * 0.56]
    t = table(data, col_widths=col_w)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    elems.append(t)
    return elems + sep()


def section_codigo() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("9. Estado do código (Fase 1 completa)", H1),
        Paragraph(
            "A Fase 1 (fundação do core) foi implementada e testada — "
            "<b>21 testes passando</b>. A estrutura abaixo está viva no repo "
            "<font name='Courier'>Gustavo-dev04/SPEXTc</font>, "
            "branch <font name='Courier'>claude/loving-cannon-w66dmi</font>.",
            BODY,
        ),
        Spacer(1, 0.2 * cm),
        Paragraph(
            'spext/<br/>'
            '&nbsp;&nbsp;core/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Perception Core — agnóstico de domínio<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;tokens.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Token / TokenSet (contrato central)<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;versioning.py &nbsp;&nbsp;&nbsp;&nbsp;# ModelRef "nome@versao"<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;pipeline.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# PipelineKind + Pipeline (ABC)<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;pipelines.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Detection / SegClassif + StubPipeline<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;domain.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Domain declarativo<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;registry.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# DomainRegistry<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;perception.py &nbsp;&nbsp;&nbsp;&nbsp;# PerceptionCore<br/>'
            '&nbsp;&nbsp;domains/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Domínios plugáveis<br/>'
            '&nbsp;&nbsp;&nbsp;&nbsp;baja.py · soja.py · carro_senac.py<br/>'
            '&nbsp;&nbsp;edge/runtime.py &nbsp;&nbsp;&nbsp;&nbsp;# Esqueleto runtime Pi 5<br/>'
            '&nbsp;&nbsp;cloud/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Esqueleto metade de nuvem<br/>'
            'tests/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 21 testes (token, registry, perception)',
            CODE,
        ),
        Spacer(1, 0.3 * cm),
        Paragraph("O que já está provado em código:", H3),
    ]
    data = [
        ["O que", "Como está provado"],
        ["Token é real", "Validação Pydantic: bbox coerente, confiança 0–1, extras proibidos"],
        ["Dois paradigmas convivem", "DetectionPipeline e SegClassifPipeline atrás do mesmo TokenSet"],
        ["Domínio é declarativo", "Baja, Soja e Carro registrados; TCC = módulo + registro"],
        ["Wiring ponta a ponta", "test_perception: imagem→tokens→thresholds→decisão via StubPipeline"],
        ["Versionamento", "ModelRef valida 'nome@versao'; TokenSet carrega a versão exata"],
    ]
    col_w = [W * 0.30, W * 0.70]
    elems.append(table(data, col_widths=col_w))
    return elems + sep()


def section_roadmap() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("10. Roadmap", H1),
        Paragraph(
            "Horizonte: <b>6 meses a 2 anos</b>. "
            "Primeiro marco prático: competição de carros autônomos no SENAC.",
            BODY,
        ),
        Spacer(1, 0.3 * cm),
    ]
    data = [
        ["Fase", "Entregas", "Status"],
        ["0 — Blueprint", "Visão, arquitetura, domínios, borda, learning loop\ndocumentados no repo", "✅ Concluída"],
        ["1 — Fundação do core", "Token/TokenSet (Pydantic), Domain Registry,\nPipelines (esqueletos + Stub), 21 testes", "✅ Concluída"],
        ["2 — Portar domínios", "Soja plugável (EfficientNet .keras → TokenSet)\nBaja plugável (YOLO demo → TokenSet)\nFrontend único com overlay para qualquer domínio", "🔜 Próxima"],
        ["3 — Borda Pi 5", "Export Keras→TFLite e YOLO→ONNX quantizados\nSPEXT Runtime: modelo exportado → TokenSet\nBuffer local resiliente a offline", ""],
        ["4 — Carro SENAC", "Vocabulário e pipeline real-time definidos\nFeedback automático fechado (desempenho = treino)", ""],
        ["5 — Learning Loop", "Ingestão → retreino → A/B → re-export\nVolta completa do flywheel demonstrada", ""],
        ["6 — Plataforma / TCCs", "Onboarding de novos domínios por terceiros\nAPI documentada, dashboard multi-domínio\nDeploy: HF Spaces + Vercel", ""],
    ]
    col_w = [W * 0.22, W * 0.60, W * 0.18]
    t = table(data, col_widths=col_w)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d1d5db")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 1), (-1, 2), colors.HexColor("#f0fdf4")),
    ]))
    elems.append(t)
    elems += [
        Spacer(1, 0.4 * cm),
        Paragraph("Linhas de pesquisa / TCC (paralelas):", H3),
        Paragraph("• <b>Tokenização avançada:</b> subir de tokens de objeto para patches (ViT) ou tokens discretos (VQ-VAE).", BULLET),
        Paragraph("• <b>Model compression:</b> destilar EfficientNet/YOLO para &lt; 1 MB rodando no ESP32.", BULLET),
        Paragraph("• <b>Aprendizado contínuo:</b> feedback de operação fechada como objeto de estudo e publicação.", BULLET),
        Paragraph("• <b>NIR/multiespectral:</b> defeitos internos invisíveis ao RGB (horizonte, herdado da Soja).", BULLET),
    ]
    return elems + sep()


def section_repos() -> list:
    W = PAGE_W - 2 * MARGIN
    elems = [
        Paragraph("11. Repositórios relacionados", H1),
    ]
    data = [
        ["Repositório", "O que é", "Estado"],
        ["Gustavo-dev04/SPEXTc", "Plataforma central (este projeto)", "Em desenvolvimento ✅"],
        ["Gustavo-dev04/Baja", "Inspeção de pintura\n(YOLO + FastAPI + Next.js)", "Protótipo demo"],
        ["Gustavo-dev04/soja-inspectio-\n(branch: claude/soja-inspection-setup-b2jaG)",
         "Inspeção de soja\n(EfficientNet + FastAPI + Next.js + Supabase)", "Modelos treinados ✅"],
    ]
    col_w = [W * 0.38, W * 0.36, W * 0.26]
    elems.append(table(data, col_widths=col_w))
    elems += [
        Spacer(1, 0.4 * cm),
        Paragraph("Nota sobre o nome", H3),
        Paragraph(
            "O repositório foi renomeado de <font name='Courier'>SPEXT</font> para "
            "<font name='Courier'>SPEXTc</font> no GitHub. "
            "O redirect está ativo, mas o remote local ainda aponta para o nome antigo. "
            "Rodar <font name='Courier'>git remote set-url origin "
            "https://github.com/Gustavo-dev04/SPEXTc.git</font> quando conveniente.",
            BODY,
        ),
    ]
    return elems


def add_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 1.2 * cm, "SPEXTc — Documento de Contexto Completo")
    canvas.drawRightString(PAGE_W - MARGIN, 1.2 * cm, f"Página {doc.page}")
    canvas.restoreState()


def build():
    out = "/home/user/SPEXT/SPEXTc_contexto.pdf"
    doc = SimpleDocTemplate(
        out, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title="SPEXTc — Documento de Contexto Completo",
        author="Gustavo Barros",
    )
    story = (
        cover_page()
        + section_visao()
        + section_dominios()
        + section_arquitetura()
        + section_token()
        + section_borda()
        + section_learning_loop()
        + section_modelos()
        + section_decisoes()
        + section_codigo()
        + section_roadmap()
        + section_repos()
    )
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"PDF gerado: {out}")


if __name__ == "__main__":
    build()
