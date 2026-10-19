"""Builds the single-file frontend-slides deck (custom "run matrix" style, Clever Cloud colours)."""
import pathlib
import sys

SKILL = pathlib.Path.home() / ".claude/skills/frontend-slides"
OUT = pathlib.Path(sys.argv[1])
VIEWPORT_BASE = (SKILL / "viewport-base.css").read_text()

TITLE = "Évaluer une doc pour agents"

CSS = """
/* ===========================================
   THEME: Clever Cloud colours (from default-theme.css)
   Change these to change the whole look
   =========================================== */
:root {
    --navy: #012A51;        /* blue-100 */
    --navy-deep: #011a33;
    --navy-lift: #0a4a86;
    --blue: #3569AA;        /* blue-60 */
    --ice: #CEDCFF;         /* blue-30 */
    --paper: #F5F5F5;       /* grey-10 */
    --red: #F72D36;         /* red-70 */
    --red-deep: #BE242D;    /* red-100 */
    --rose: #FBC8C2;        /* red-30 */
    --stage-bg: #000d1a;
    --slide-bg: var(--navy);
    --font-display: 'Bricolage Grotesque', sans-serif;
    --font-body: 'Instrument Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ===========================================
   BASE
   =========================================== */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* --- viewport-base.css (mandatory, included in full) --- */
__VIEWPORT_BASE__

/* ===========================================
   SLIDE SURFACES
   =========================================== */
.slide {
    color: var(--paper);
    font-family: var(--font-body);
    background: radial-gradient(1300px 900px at 82% 30%, var(--navy-lift) 0%, var(--navy) 55%, var(--navy-deep) 100%);
}
.slide.alt { background: radial-gradient(1300px 900px at 12% 85%, var(--navy-lift) 0%, var(--navy) 55%, var(--navy-deep) 100%); }
.slide.statement { background: linear-gradient(135deg, var(--red-deep) 0%, #8f1820 100%); }

/* Content frame: everything sits inside these margins */
.pad { position: absolute; left: 96px; right: 96px; top: 84px; bottom: 112px; display: flex; flex-direction: column; gap: 52px; }
.pad.spread { justify-content: space-between; }

/* Deck chrome on every content slide */
.chrome { position: absolute; left: 96px; right: 96px; bottom: 44px; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 22px; color: var(--ice); opacity: .75; }

/* ===========================================
   TYPE
   =========================================== */
.kicker { font-family: var(--font-mono); font-size: 24px; letter-spacing: 1px; color: var(--rose); text-transform: uppercase; }
h1 { font-family: var(--font-display); font-weight: 700; font-size: 128px; line-height: 1; letter-spacing: -3px; }
h2 { font-family: var(--font-display); font-weight: 700; font-size: 80px; line-height: 1.04; letter-spacing: -2px; max-width: 1600px; }
h3 { font-family: var(--font-display); font-weight: 700; font-size: 46px; line-height: 1.12; letter-spacing: -.5px; }
p, li, td, th { font-size: 34px; line-height: 1.4; }
.soft { color: var(--ice); }
.mono { font-family: var(--font-mono); }
.big { font-family: var(--font-display); font-weight: 700; font-size: 112px; line-height: 1; letter-spacing: -3px; }
.head { display: flex; flex-direction: column; gap: 18px; }

/* ===========================================
   COMPONENTS
   =========================================== */
.row { display: flex; gap: 32px; }
.row > * { flex: 1; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.panel { background: rgba(245, 245, 245, .07); border: 1px solid rgba(206, 220, 255, .3); border-radius: 22px; padding: 46px 48px; display: flex; flex-direction: column; gap: 20px; }
.panel p { color: var(--ice); }
.panel.light { background: var(--paper); color: var(--navy); border-color: var(--paper); }
.panel.light p { color: #33485f; }
.num { font-family: var(--font-mono); font-size: 26px; color: var(--rose); }
.strip { background: rgba(1, 26, 51, .65); border-left: 6px solid var(--red); border-radius: 0 16px 16px 0; padding: 26px 34px; }
.strip p { color: var(--paper); font-size: 32px; }
.stack { display: flex; flex-direction: column; gap: 14px; }
.arrow { flex: 0 0 44px; align-self: center; font-family: var(--font-mono); font-size: 44px; color: var(--ice); text-align: center; }

/* Tables */
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-family: var(--font-mono); font-weight: 500; font-size: 24px; letter-spacing: 1px; text-transform: uppercase; color: var(--rose); padding: 0 24px 18px 0; border-bottom: 2px solid rgba(206, 220, 255, .5); }
td { font-size: 32px; padding: 30px 24px 30px 0; border-bottom: 1px solid rgba(206, 220, 255, .25); vertical-align: top; }
td.soft { color: var(--ice); }

/* The signature device: one dot per run */
.matrix { display: grid; gap: var(--gap, 22px); }
.dot { aspect-ratio: 1; border-radius: 50%; background: var(--paper); opacity: 0; transform: scale(.2); transition: opacity .5s var(--ease), transform .5s var(--ease); }
.dot.miss { background: transparent; border: var(--ring, 5px) solid var(--red); }
.slide.statement .dot.miss { border-color: var(--paper); }
.slide.visible .dot { opacity: 1; transform: none; }

/* Diagrams: absolutely placed nodes over an SVG of arrows */
.diagram { position: relative; width: 1728px; }
.diagram svg { position: absolute; left: 0; top: 0; max-width: none; max-height: none; pointer-events: none; }
.node { position: absolute; border-radius: 16px; padding: 18px 22px; display: flex; flex-direction: column; justify-content: center; gap: 4px; background: var(--paper); color: var(--navy); }
.node h3 { font-size: 34px; letter-spacing: 0; }
.node p { font-size: 26px; line-height: 1.25; color: #33485f; }
.node.ghost { background: transparent; color: var(--paper); border: 3px dashed var(--ice); }
.node.ghost p { color: var(--ice); }
.node.agent { background: var(--red-deep); color: var(--paper); }
.node.agent p { color: var(--rose); }
.node.check { background: var(--ice); }
.node.bad { background: var(--red); color: var(--paper); }
.node.bad p { color: var(--paper); }
.label { position: absolute; font-family: var(--font-mono); font-size: 26px; color: var(--rose); text-transform: uppercase; letter-spacing: 1px; }

/* ===========================================
   ANIMATION: staggered reveal on the visible slide
   =========================================== */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s var(--ease), transform .7s var(--ease); transition-delay: calc(var(--i, 0) * 90ms); }
.slide.visible .reveal { opacity: 1; transform: none; }

/* ===========================================
   UI OUTSIDE THE STAGE (progress, notes, edit)
   =========================================== */
.progress { position: fixed; left: 0; bottom: 0; height: 4px; background: var(--red); z-index: 1000; transition: width .3s var(--ease); }
.notes { position: fixed; left: 0; right: 0; bottom: 0; max-height: 34vh; overflow: auto; padding: clamp(12px, 2vw, 24px) clamp(16px, 4vw, 48px); background: rgba(1, 13, 26, .96); color: var(--paper); font: 400 clamp(14px, 1.3vw, 20px)/1.5 var(--font-body); border-top: 2px solid var(--red); z-index: 1001; display: none; }
.notes.show { display: block; }
.edit-hotzone { position: fixed; top: 0; left: 0; width: 80px; height: 80px; z-index: 10000; cursor: pointer; }
.edit-toggle { position: fixed; top: 16px; left: 16px; border: 0; border-radius: 10px; padding: 8px 12px; font-size: 18px; background: var(--paper); cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .3s ease; z-index: 10001; }
.edit-toggle.show, .edit-toggle.active { opacity: 1; pointer-events: auto; }
.edit-toggle.active { background: var(--red); color: #fff; }
[contenteditable="true"] { outline: 2px dashed var(--rose); outline-offset: 6px; }
@media print { .progress, .notes, .edit-hotzone, .edit-toggle { display: none !important; } .reveal, .dot { opacity: 1 !important; transform: none !important; } }
""".replace("__VIEWPORT_BASE__", VIEWPORT_BASE)


def head(kicker, title):
    return f'<div class="head"><p class="kicker reveal">{kicker}</p><h2 class="reveal" style="--i:1">{title}</h2></div>'


def panel(i, title, *paras, cls="", num=None):
    n = f'<p class="num">{num}</p>' if num else ""
    body = "".join(f"<p>{p}</p>" for p in paras)
    return f'<div class="panel {cls} reveal" style="--i:{i}">{n}<h3>{title}</h3>{body}</div>'


KY = 1.2  # vertical stretch applied to both diagrams
COLORS = {"ice": "#CEDCFF", "red": "#F72D36", "paper": "#F5F5F5"}


def arrow_defs(prefix):
    # marker ids must be unique per diagram: a marker defined in a hidden slide's SVG does not render elsewhere
    markers = "".join(
        f'<marker id="{prefix}-{name}" orient="auto" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="22" refY="11"><path d="M0 0 L22 11 L0 22 Z" fill="{fill}"/></marker>'
        for name, fill in COLORS.items()
    )
    return f"<defs>{markers}</defs>"


def line(prefix, x1, y1, x2, y2, color="ice", dashed=False, width=4):
    dash = ' stroke-dasharray="12 10"' if dashed else ""
    return f'<line x1="{x1 + 14}" y1="{y1 * KY:.0f}" x2="{x2 - 14}" y2="{y2 * KY:.0f}" stroke="{COLORS[color]}" stroke-width="{width}"{dash} marker-end="url(#{prefix}-{color})"/>'


def node(x, y, w, h, title, sub="", cls=""):
    s = f"<p>{sub}</p>" if sub else ""
    return f'<div class="node {cls}" style="left:{x}px;top:{y * KY:.0f}px;width:{w}px;height:{h * KY:.0f}px"><h3>{title}</h3>{s}</div>'


# --- Diagram 1: one run, from task to grade -----------------------------------
D1_H = 470
d1 = f"""<div class="diagram reveal" style="--i:2;height:{D1_H * KY:.0f}px">
<svg width="1728" height="{D1_H * KY:.0f}" viewBox="0 0 1728 {D1_H * KY:.0f}" aria-label="La tâche, AGENTS.md et les docs entrent dans l'agent ; le transcript et l'état final en sortent ; trois vérifications les notent.">{arrow_defs("d1")}
{line("d1", 360, 60, 480, 60)}{line("d1", 360, 235, 480, 235)}{line("d1", 360, 410, 480, 410, dashed=True)}
{line("d1", 880, 120, 1010, 120)}{line("d1", 880, 350, 1010, 350)}
{line("d1", 1330, 120, 1450, 120)}{line("d1", 1330, 290, 1450, 290)}{line("d1", 1330, 410, 1450, 410)}
</svg>
{node(0, 0, 360, 120, "1. La tâche", "une phrase, comme un collègue")}
{node(0, 175, 360, 120, "AGENTS.md", "chargé à chaque session")}
{node(0, 350, 360, 120, "docs/contributing", "lues si l'agent le décide", "ghost")}
{node(480, 0, 400, D1_H, "2. L'agent travaille", "seul, dans une copie jetable du dépôt, sans historique git", "agent")}
{node(1010, 60, 320, 120, "Le transcript", "fichiers lus, commandes")}
{node(1010, 235, 320, 235, "3. L'état final", "le diff laissé dans le dépôt, ou la réponse")}
{node(1450, 60, 278, 120, "Docs lues ?", "", "check")}
{node(1450, 235, 278, 110, "Règle suivie ?", "", "check")}
{node(1450, 360, 278, 110, "Format, lint ?", "", "check")}
</div>"""

# --- Diagram 2: where the rule lives -------------------------------------------
D2_H = 580
d2 = f"""<div class="diagram reveal" style="--i:2;height:{D2_H * KY:.0f}px">
<svg width="1728" height="{D2_H * KY:.0f}" viewBox="0 0 1728 {D2_H * KY:.0f}" aria-label="Avant : la règle dans la doc est ignorée, le code voisin est copié, 0 sur 6. Après : la règle dans AGENTS.md est suivie, 6 sur 6.">{arrow_defs("d2")}
{line("d2", 680, 60, 840, 60, dashed=True)}{line("d2", 680, 200, 840, 200, color="red", width=5)}{line("d2", 1160, 130, 1300, 130, color="red", width=5)}
{line("d2", 680, 380, 840, 380, color="paper", width=5)}{line("d2", 680, 520, 840, 520, dashed=True)}{line("d2", 1160, 450, 1300, 450, color="paper", width=5)}
</svg>
<p class="label" style="left:0;top:{108 * KY:.0f}px">Avant</p>
{node(220, 0, 460, 120, "Règle dans la doc", "parfois lue, pas appliquée", "ghost")}
{node(220, 140, 460, 120, "Le code voisin", "sans fallback, copié par l'agent")}
{node(840, 0, 320, 260, "L'agent", "", "agent")}
{node(1300, 60, 428, 140, "0 sur 6", "la règle n'est pas suivie", "bad")}
<p class="label" style="left:0;top:{428 * KY:.0f}px">Après</p>
{node(220, 320, 460, 120, "Règle dans AGENTS.md", "toujours chargée, appliquée")}
{node(220, 460, 460, 120, "Le code voisin", "sans fallback, inchangé, plus copié", "ghost")}
{node(840, 320, 320, 260, "L'agent", "", "agent")}
{node(1300, 380, 428, 140, "6 sur 6", "la règle est suivie", "check")}
</div>"""


def dots(n, cols, miss="", size=None, gap=22, ring=5):
    width = f"width:{size}px;" if size else ""
    return f'<div class="matrix" data-n="{n}" data-miss="{miss}" style="grid-template-columns:repeat({cols},1fr);{width}--gap:{gap}px;--ring:{ring}px"></div>'


SLIDES = [
    # 1: cover
    (
        "",
        f"""<p class="kicker reveal" style="position:absolute;left:96px;top:88px">clever-components / AGENTS.md</p>
<h1 class="reveal" style="--i:1;position:absolute;left:96px;top:250px;width:900px">{TITLE}</h1>
<p class="soft reveal" style="--i:2;position:absolute;left:96px;top:700px;width:820px;font-size:36px">Ce qu'on a mesuré en appliquant build-eval à AGENTS.md, et ce que ça a changé.</p>
<p class="mono soft reveal" style="--i:3;position:absolute;left:96px;bottom:80px;font-size:24px">octobre 2026</p>
<div style="position:absolute;left:1100px;top:210px">{dots(72, 9, "13,30,41,58,66", size=724)}</div>
<p class="mono reveal" style="--i:6;position:absolute;left:1100px;top:880px;width:724px;display:flex;justify-content:space-between;font-size:26px"><span>72 runs</span><span style="color:var(--rose)">67 ont lu la bonne doc</span></p>""",
        "Plan : ce qu'est Claude API et le skill, les deux sous-commandes, à quoi elles servent, comment une eval se construit, puis l'application à notre doc pour agents et les résultats. Chaque point à droite est un run de l'eval ; les cercles rouges sont ceux où l'agent n'a pas ouvert la doc attendue.",
    ),
    # 2: what is Claude API
    (
        "alt",
        f"""<div class="pad">{head("C'est quoi", "Claude API : une API, et un skill dans Claude Code")}
<div class="row">
{panel(2, "L'API", "Le moyen d'appeler les modèles Claude depuis un programme : on envoie des messages, on reçoit une réponse.", "C'est ce qui tourne derrière Claude Code et les autres agents de code.")}
{panel(3, '<span class="mono">/claude-api</span>', "Un skill livré avec Claude Code : une référence à jour sur l'API, et des procédures guidées qu'on lance par sous-commande.", "Deux nous intéressent : <b>prompt-audit</b> et <b>build-eval</b>.", cls="light")}
</div></div>""",
        "Deux sens du même nom. L'API, c'est le produit d'Anthropic. Le skill, c'est un paquet d'instructions que Claude Code charge quand on tape /claude-api. Les autres sous-commandes (migration de modèle, optimisation des coûts) ne sont pas le sujet ici.",
    ),
    # 3: the two subcommands
    (
        "",
        f"""<div class="pad">{head("Les deux sous-commandes", "Relire les instructions, ou mesurer leur effet")}
<div class="row">
{panel(2, '<span class="mono">prompt-audit</span>', "<b style='color:var(--paper)'>« Mes instructions sont-elles encore justes ? »</b>", "Relit les prompts, CLAUDE.md, AGENTS.md et les skills. Cherche le texte écrit pour d'anciens modèles, les faits périmés, les contradictions.", "Rend un rapport et un diff proposé. Rien n'est appliqué sans accord.")}
{panel(3, '<span class="mono">build-eval</span>', "<b style='color:var(--paper)'>« Est-ce que ça marche, et mon changement a-t-il aidé ? »</b>", "Construit un jeu de cas, un script qui les lance et une façon de noter chaque résultat.", "Rend un chiffre qu'on peut remesurer après chaque modification.")}
</div></div>""",
        "prompt-audit est une relecture : il lit le texte et dit ce qui est daté. build-eval est une mesure : il fait tourner le système et compte. Les deux se complètent. Dans ce travail, c'est build-eval qui a été utilisé ; prompt-audit serait l'étape complémentaire.",
    ),
    # 4: why
    (
        "alt",
        f"""<div class="pad">{head("À quoi ça sert", "Sans mesure, on règle une doc d'agent à l'intuition")}
<div class="row">
{panel(2, "Les instructions vieillissent", "Le code change, les modèles changent, le texte reste. Personne ne remarque quand une consigne devient fausse.")}
{panel(3, "Les agents les suivent à la lettre", "Une phrase vague ou périmée produit du mauvais code, sans erreur visible.")}
{panel(4, "Une reformulation peut aider ou casser", "Avec une eval, on le voit avant de le livrer à toute l'équipe.")}
</div></div>""",
        "L'enjeu : AGENTS.md est lu par tous les agents de l'équipe, à chaque session. Une erreur dedans se paie partout, et on ne la voit pas. L'eval sert à remplacer « je pense que c'est mieux » par un avant et un après.",
    ),
    # 5: how
    (
        "",
        f"""<div class="pad">{head("Comment ça marche", "Des cas, un lanceur, une notation")}
<div style="display:flex;gap:14px;align-items:stretch">
{panel(2, "Cadrer", "Un seul comportement à mesurer, et par où on le lance.", num="01")}
<div class="arrow reveal" style="--i:2">→</div>
{panel(3, "Les cas", "15 à 100 tâches réalistes, relues et validées par un humain.", num="02")}
<div class="arrow reveal" style="--i:3">→</div>
{panel(4, "La notation", "Des vérifications par programme d'abord, validées sur un pilote.", num="03")}
<div class="arrow reveal" style="--i:4">→</div>
{panel(5, "Lancer", "Plusieurs répétitions, un rapport, puis on relance après chaque changement.", num="04")}
</div>
<div class="strip reveal" style="--i:6"><p>Deux validations humaines sont obligatoires, sur les cas puis sur la notation. Le coût est mesuré sur un pilote avant le run complet.</p></div>
</div>""",
        "Le skill mène un entretien : il propose, on valide. Il insiste sur deux points : montrer tous les cas avant de lancer, et montrer des exemples notés avant de faire confiance à la note. Pour un agent qui modifie du code, on note l'état final (les fichiers), pas ce que l'agent raconte.",
    ),
    # 6: applied to the project
    (
        "alt",
        f"""<div class="pad">{head("Appliqué à clever-components", "Les agents ouvrent-ils les docs vers lesquelles AGENTS.md renvoie ?")}
<div class="grid2">
{panel(2, "Le lanceur", "Un agent sans surveillance reçoit une tâche dans une copie jetable du dépôt.")}
{panel(3, "Les cas", "19 tâches : 12 où une doc est nécessaire, 7 contrôles où elle ne l'est pas.")}
{panel(4, "La notation", "Par programme : docs ouvertes, règle de la doc respectée dans le diff, format et lint.")}
{panel(5, "Les runs", "Opus 5.5 et Sonnet 5.5, 3 répétitions par cas, soit 114 runs par mesure.")}
</div></div>""",
        "AGENTS.md contient les règles permanentes et un tableau qui renvoie vers docs/contributing selon la tâche. On voulait savoir si ce renvoi est suivi, et si le suivre change le résultat. On avait un juge LLM au début : il notait tout à 1, on l'a retiré.",
    ),
    # 7: diagram: one run
    (
        "",
        f"""<div class="pad">{head("Le dispositif", "Un run, de la tâche à la note")}
{d1}
<div class="strip reveal" style="--i:3"><p>4. Trois vérifications par programme, à droite. Le run est réussi quand les trois sont bonnes.</p></div>
</div>""",
        "Lecture de gauche à droite. À gauche, ce que l'agent reçoit : la tâche, AGENTS.md qui est toujours chargé, et les docs en pointillé parce que c'est l'agent qui choisit de les ouvrir. Au milieu, l'agent travaille seul. À droite, ce qu'on récupère : le transcript, qui dit quelles docs ont été ouvertes, et l'état final, sur lequel on vérifie la règle et la qualité. Tout est vérifié par des scripts.",
    ),
    # 8: example cases
    (
        "alt",
        f"""<div class="pad">{head("Exemples de cas", "Une tâche, une doc attendue, une règle vérifiée")}
<table class="reveal" style="--i:2">
<tr><th style="width:42%">Tâche donnée à l'agent</th><th style="width:24%">Doc attendue</th><th style="width:34%">Ce qu'on vérifie</th></tr>
<tr><td>« Dans cc-notice, colore le titre selon l'intent. »</td><td class="mono soft">wc-guidelines</td><td class="soft">chaque design token a une valeur de repli</td></tr>
<tr><td>« Crée un composant cc-feedback-form avec validation. »</td><td class="mono soft">forms + 3 docs composant</td><td class="soft">la directive formSubmit, pas un submit fait main</td></tr>
<tr><td>« Pourquoi nos tailles sont en em et pas en rem ? »</td><td class="mono soft">ADR-0021</td><td class="soft">la réponse cite la raison écrite dans l'ADR</td></tr>
<tr><td>« Que fait la propriété weight de cc-badge ? »</td><td class="mono soft">aucune (contrôle)</td><td class="soft">réponse exacte, aucun fichier modifié</td></tr>
</table></div>""",
        "19 cas en tout, de ce type. Trois familles : des modifications de code où une règle n'existe que dans une doc, des questions dont la réponse est dans une doc, et des contrôles où aucune doc n'est nécessaire. Les contrôles servent à vérifier que les agents ne lisent pas tout systématiquement.",
    ),
    # 9: the lesson (statement slide)
    (
        "statement",
        f"""<div class="pad spread">
<p class="kicker reveal" style="color:var(--paper)">Ce qu'on a appris</p>
<h2 class="reveal" style="--i:1;font-size:96px;max-width:1500px">Une règle écrite seulement dans une doc perd contre le code voisin.</h2>
<div class="row">
<div class="stack reveal" style="--i:2"><h3>Le renvoi marche</h3><p>Pour « lequel j'utilise ? » et « comment je lance ça ? », les agents vont à la bonne doc.</p></div>
<div class="stack reveal" style="--i:3"><h3>Ils copient le voisin</h3><p>Pour une petite modification, ils ne lisent pas la doc. Si le voisin est conforme, tout va bien.</p></div>
<div class="stack reveal" style="--i:4"><h3>Lire n'est pas suivre</h3><p>Sur un cas, 6 runs sur 6 ont copié le mauvais motif, même après avoir lu la doc.</p></div>
</div></div>""",
        "Le cas en question : ajouter une couleur de titre dans cc-notice. La doc dit que chaque design token doit avoir une valeur de repli. Le fichier cc-notice n'en a presque pas. Résultat : tous les agents ont copié le fichier, pas la doc.",
    ),
    # 10: diagram: where the rule lives
    (
        "",
        f"""<div class="pad">{head("Le mécanisme", "La même règle, écrite à deux endroits")}
{d2}
</div>""",
        "En haut, la règle n'est que dans wc-guidelines.md et le fichier cc-notice ne la respecte presque jamais : les six runs ont copié le fichier, y compris ceux qui avaient ouvert la doc. En bas, on a écrit la même règle en une phrase dans AGENTS.md, sans toucher au code : six sur six. Trait plein : la source que l'agent suit. Pointillé : celle qu'il ne suit pas.",
    ),
    # 11: before / after
    (
        "alt",
        f"""<div class="pad">{head("Résultats", "Deux phrases dans AGENTS.md, deux cas passés de 0 à 6 sur 6")}
<div style="display:grid;grid-template-columns:1fr 360px 360px;column-gap:56px;row-gap:44px;align-items:center">
<p class="mono reveal" style="--i:2;font-size:24px;color:var(--rose);text-transform:uppercase;letter-spacing:1px">Changement</p>
<p class="mono reveal" style="--i:2;font-size:24px;color:var(--rose);text-transform:uppercase;letter-spacing:1px">Avant</p>
<p class="mono reveal" style="--i:2;font-size:24px;color:var(--rose);text-transform:uppercase;letter-spacing:1px">Après</p>
<div class="reveal" style="--i:3"><h3>Créer un composant : toujours lire les trois docs</h3><p class="soft">docs lues par l'agent</p></div>
<div>{dots(6, 6, "0,1,2,3,4,5", gap=14, ring=5)}<p class="mono soft" style="margin-top:14px">0 sur 6</p></div>
<div>{dots(6, 6, "", gap=14)}<p class="mono" style="margin-top:14px">6 sur 6</p></div>
<div class="reveal" style="--i:4"><h3>Design tokens : la règle du fallback écrite sur place</h3><p class="soft">règle respectée dans le diff</p></div>
<div>{dots(6, 6, "0,1,2,3,4,5", gap=14, ring=5)}<p class="mono soft" style="margin-top:14px">0 sur 6</p></div>
<div>{dots(6, 6, "", gap=14)}<p class="mono" style="margin-top:14px">6 sur 6</p></div>
</div></div>""",
        "Un point par run, 3 répétitions sur chacun des deux modèles. Cercle rouge : raté. Point plein : réussi. Autres changements issus de l'eval : une ligne release dans le tableau de renvoi, une erreur corrigée dans smart-component.md.",
    ),
    # 12: final reference
    (
        "",
        f"""<div class="pad">{head("La mesure de référence", "19 cas, 3 répétitions, deux modèles")}
<div style="display:flex;gap:72px;align-items:center">
<div style="flex:1;display:flex;flex-direction:column;gap:34px">
<div class="reveal" style="--i:2"><p class="big">67 <span style="font-size:48px;letter-spacing:0">sur 72</span></p><p class="soft">runs où les docs requises ont été lues (Opus 34 sur 36, Sonnet 33 sur 36)</p></div>
<div class="reveal" style="--i:3"><p class="big">71 <span style="font-size:48px;letter-spacing:0">sur 72</span></p><p class="soft">runs où la règle propre à la doc est respectée</p></div>
<div class="reveal" style="--i:4"><p class="big">42 <span style="font-size:48px;letter-spacing:0">sur 42</span></p><p class="soft">contrôles réussis, sur les tâches sans doc</p></div>
</div>
<div style="flex:0 0 620px">{dots(72, 9, "13,30,41,58,66", size=620, gap=18)}<p class="mono soft" style="margin-top:22px;font-size:24px">docs requises lues : 67 points pleins, 5 cercles</p></div>
</div></div>""",
        "Mesure finale, sur le code actuel après le retrait de l'ancien client API. L'écart entre Opus et Sonnet est dans le bruit, on ne s'en sert pas pour les classer. Le seul run où la règle n'est pas respectée est un agent qui s'est arrêté sur un plan sans écrire de code.",
    ),
    # 13: what next
    (
        "alt",
        f"""<div class="pad">{head("Et après", "Ce qui doit toujours tenir va dans AGENTS.md ou dans l'outillage")}
<div class="row">
{panel(2, "Outiller plutôt qu'écrire", "Une règle stylelint ou un hook ne dépend pas de ce que l'agent a lu. Retirer l'ancien client du code a mieux marché que toute consigne.")}
{panel(3, "L'eval est au plafond", "Elle détecte une régression, pas une amélioration. Pour apprendre plus, il faut des cas plus durs, pas plus de répétitions.")}
{panel(4, "Le coût", "Environ 26 $ pour une mesure complète, environ 80 $ pour tout le travail. À relancer quand AGENTS.md ou le code change beaucoup.")}
</div></div>""",
        "Règles encore seulement dans les docs alors que le code existant est incohérent : readonly plutôt que disabled pendant une sauvegarde, role group plutôt que fieldset, le helper plural. Ce sont les prochaines candidates à une règle outillée ou à une phrase dans AGENTS.md. Coûts aux tarifs API rapportés par l'outil.",
    ),
    # 14: closing
    (
        "",
        f"""<p class="kicker reveal" style="position:absolute;left:96px;top:88px">À retenir</p>
<h1 class="reveal" style="--i:1;position:absolute;left:96px;top:230px;width:1250px;font-size:112px">Écrire la règle là où l'agent la lit toujours. Puis mesurer.</h1>
<p class="soft reveal" style="--i:2;position:absolute;left:96px;top:760px;width:1000px;font-size:36px">Questions ?</p>
<div style="position:absolute;right:96px;top:250px">{dots(36, 6, "", size=360, gap=18)}</div>""",
        "Résumé en une phrase. Si on ne devait garder qu'une chose : une doc pour agents se règle comme du code, avec une mesure avant et après.",
    ),
]

JS = r"""
/* ===========================================
   SLIDE PRESENTATION CONTROLLER
   Keyboard, wheel and touch navigation, stage scaling,
   progress bar, speaker notes (N) and the dot matrices.
   =========================================== */
class SlidePresentation {
    constructor() {
        this.slides = [...document.querySelectorAll('.slide')];
        this.stage = document.getElementById('deckStage');
        this.progress = document.getElementById('progress');
        this.notes = document.getElementById('notes');
        this.current = 0;
        this.buildMatrices();
        this.setupStageScale();
        this.setupKeyboardNav();
        this.setupWheelNav();
        this.setupTouchNav();
        const fromHash = parseInt(location.hash.slice(1), 10);
        this.showSlide(Number.isFinite(fromHash) ? fromHash - 1 : 0);
    }

    /* One dot per run: data-n dots, data-miss lists the hollow ones */
    buildMatrices() {
        document.querySelectorAll('.matrix').forEach((m) => {
            const miss = new Set((m.dataset.miss || '').split(',').filter(Boolean).map(Number));
            const n = Number(m.dataset.n);
            for (let i = 0; i < n; i++) {
                const d = document.createElement('div');
                d.className = 'dot' + (miss.has(i) ? ' miss' : '');
                d.style.transitionDelay = (250 + i * (n > 12 ? 16 : 70)) + 'ms';
                m.appendChild(d);
            }
        });
    }

    setupStageScale() {
        const scale = () => {
            const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
            const x = (window.innerWidth - 1920 * factor) / 2;
            const y = (window.innerHeight - 1080 * factor) / 2;
            this.stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
        };
        scale();
        window.addEventListener('resize', scale);
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.target.isContentEditable) return;
            if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); this.next(); }
            else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); this.prev(); }
            else if (e.key === 'Home') this.showSlide(0);
            else if (e.key === 'End') this.showSlide(this.slides.length - 1);
            else if (e.key === 'n' || e.key === 'N') this.notes.classList.toggle('show');
        });
    }

    setupWheelNav() {
        let locked = false;
        window.addEventListener('wheel', (e) => {
            if (locked || Math.abs(e.deltaY) < 20 || this.notes.contains(e.target)) return;
            locked = true;
            e.deltaY > 0 ? this.next() : this.prev();
            setTimeout(() => (locked = false), 600);
        }, { passive: true });
    }

    setupTouchNav() {
        let startX = null;
        window.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
        window.addEventListener('touchend', (e) => {
            if (startX == null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
            startX = null;
        });
    }

    next() { this.showSlide(this.current + 1); }
    prev() { this.showSlide(this.current - 1); }

    showSlide(index) {
        this.current = Math.max(0, Math.min(index, this.slides.length - 1));
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.current);
            slide.classList.toggle('visible', i === this.current);
        });
        this.progress.style.width = ((this.current + 1) / this.slides.length) * 100 + '%';
        this.notes.textContent = this.slides[this.current].dataset.notes || '';
        history.replaceState(null, '', '#' + (this.current + 1));
    }
}

/* ===========================================
   INLINE EDITING
   Hover the top-left corner or press E, click any text, Ctrl+S saves a copy.
   =========================================== */
class InlineEditor {
    constructor() {
        this.isActive = false;
        this.key = 'deck-edits:' + location.pathname;
        this.toggle = document.getElementById('editToggle');
        this.targets = () => document.querySelectorAll('.slide h1, .slide h2, .slide h3, .slide p, .slide td, .slide th');
        const saved = localStorage.getItem(this.key);
        if (saved) {
            try {
                const texts = JSON.parse(saved);
                this.targets().forEach((el, i) => { if (texts[i] != null && !el.querySelector('.matrix')) el.innerHTML = texts[i]; });
            } catch { /* ignore a corrupt draft */ }
        }
        document.addEventListener('input', () => this.isActive && this.save());
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); this.exportFile(); }
            else if ((e.key === 'e' || e.key === 'E') && !e.target.isContentEditable) this.toggleEditMode();
            else if (e.key === 'Escape' && this.isActive) this.toggleEditMode();
        });
    }
    toggleEditMode() {
        this.isActive = !this.isActive;
        this.targets().forEach((el) => el.setAttribute('contenteditable', this.isActive ? 'true' : 'false'));
        this.toggle.classList.toggle('active', this.isActive);
        this.toggle.classList.toggle('show', this.isActive);
    }
    save() { localStorage.setItem(this.key, JSON.stringify([...this.targets()].map((el) => el.innerHTML))); }
    exportFile() {
        const wasActive = this.isActive;
        if (wasActive) this.toggleEditMode();
        const blob = new Blob(['<!DOCTYPE html>\n' + document.documentElement.outerHTML], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = location.pathname.split('/').pop() || 'slides.html';
        a.click();
        URL.revokeObjectURL(a.href);
        if (wasActive) this.toggleEditMode();
    }
}

new SlidePresentation();
const editor = new InlineEditor();

/* Edit button: JS-driven hover with a 400ms grace period (a CSS sibling selector would lose the hover) */
const hotzone = document.querySelector('.edit-hotzone');
const editToggle = document.getElementById('editToggle');
let hideTimeout = null;
const show = () => { clearTimeout(hideTimeout); editToggle.classList.add('show'); };
const hide = () => { hideTimeout = setTimeout(() => { if (!editor.isActive) editToggle.classList.remove('show'); }, 400); };
hotzone.addEventListener('mouseenter', show);
hotzone.addEventListener('mouseleave', hide);
editToggle.addEventListener('mouseenter', show);
editToggle.addEventListener('mouseleave', hide);
hotzone.addEventListener('click', () => editor.toggleEditMode());
editToggle.addEventListener('click', () => editor.toggleEditMode());
"""


def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;")


sections = []
total = len(SLIDES)
for i, (cls, body, notes) in enumerate(SLIDES, 1):
    chrome = "" if i in (1, total) else f'<div class="chrome"><span>{TITLE}</span><span>{i:02d} / {total:02d}</span></div>'
    active = " active visible" if i == 1 else ""
    sections.append(f'<!-- ===== SLIDE {i:02d} ===== -->\n<section class="slide {cls}{active}" data-notes="{esc(notes)}">\n{body}\n{chrome}\n</section>')

HTML = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{TITLE}</title>
<!-- Fonts: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (labels) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>{CSS}</style>
</head>
<body>
<div class="deck-viewport">
<main class="deck-stage" id="deckStage">
{chr(10).join(sections)}
</main>
</div>
<!-- UI outside the stage: progress bar, speaker notes (N), edit mode (E) -->
<div class="progress" id="progress"></div>
<div class="notes" id="notes" aria-live="polite"></div>
<div class="edit-hotzone"></div>
<button class="edit-toggle" id="editToggle" title="Mode édition (E)">✏️</button>
<script>{JS}</script>
</body>
</html>
"""
OUT.write_text(HTML)
print(f"wrote {OUT} ({len(HTML)} bytes, {total} slides)")
