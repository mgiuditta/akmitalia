# Marchio

Gli **originali del cliente**, come li ha consegnati. Stanno qui perche' sono l'unica fonte che
esiste: non c'e' vettoriale, non c'e' un archivio da cui riscaricarli, e chiederli di nuovo
costa piu' di 600 KB di repository.

- `stemma-fondo-nero.jpeg` — 1600x1600, piatto, anello bianco su fondo nero. **E' la fonte** di
  `src/app/(frontend)/stemma.png` e di `icon.png`: piatto vuol dire senza gradiente e senza
  ombra, che `DESIGN.md` vieta.
- `stemma-fondo-bianco.jpg` — 2983x3026 a 300dpi, anello con gradiente argento e ombra portata.
  Piu' grande, ma con due effetti che il sistema non ammette. Serve solo se un giorno qualcuno
  vuole ritagliare il glifo a risoluzione piena.

Come si ricava l'asset del sito: ADR 0004, sezione «Come e stato ricavato». Il comando e' li',
e rigira da questi file.
