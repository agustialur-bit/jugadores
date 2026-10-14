# La flor del feedback

Il·lustració (no analítica) del "Com estàs?": cada pètal és una resposta,
col·locada amb l'espiral d'or (el patró real de creixement dels girasols).
Color = nivell de cansament reportat, mida creixent cap a fora.

Es regenera sencera cada cop (no acumula com el cel de tirs): les
jugadores reenvien totes les dades del full de càlcul, no cal guardar-les
aquí.

`template.html` té `var ROWS = __WELLNESS_DATA__;` — substituir pel JSON
`[["YYYY-MM-DD", nivell], ...]` amb nivell 1-5
(1=Molt cansada, 2=Cansada, 3=Normal, 4=Bé, 5=Molt bé), ordenat per data.

Un cop generat l'HTML, renderitzar-lo (p. ex. amb Playwright) i desar el
resultat a `../imatges/flor-feedback.jpg`, pujant la `?v=` a
`grafics.html` perquè el service worker no serveixi la còpia antiga.
