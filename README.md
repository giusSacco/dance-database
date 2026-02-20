# Dance DB

Un database personale per documentare e studiare le figure di ballo di coppia — Bachata, Salsa Cubana e Rueda de Casino.

> Progetto personale e amatoriale, nato per uso proprio. Non è un progetto professionale, ma chiunque può usarlo per scrivere le proprie note e tenere traccia delle figure che sta imparando.

## Cosa fa

- Cataloga le figure con descrizioni tecniche dettagliate (passi, preparazione, guida, intenzione)
- Tag colorati per categorizzare e filtrare le mosse
- Link video (YouTube embed, Google Drive, URL esterni)
- Area note personali per ogni figura
- Suggerimenti tecnici via AI (Google Gemini)
- Export/import JSON per i backup
- Funziona offline come PWA

---

## Per chi vuole solo usarlo

Se non ti interessa il codice e vuoi solo usarlo come app, ecco tutto quello che ti serve sapere.

### Aprilo nel browser

L'app è già disponibile online su GitHub Pages — basta aprire il link nel browser, nessuna installazione richiesta.

### Installalo sul telefono (consigliato)

Funziona come un'app vera sul telefono:

- **iOS**: apri il link in Safari > tocca "Condividi" > "Aggiungi alla schermata Home"
- **Android**: apri il link in Chrome > tocca i tre puntini > "Aggiungi alla schermata Home"

Una volta installata, funziona anche **senza connessione**.

### Scrivi le tue note

Ogni figura ha un campo "Note personali" dove puoi scrivere quello che vuoi — appunti dall'allenamento, cose da ricordare, correzioni del maestro, ecc. Le note vengono salvate automaticamente nel browser.

### Modifica i contenuti

Puoi modificare qualsiasi campo di ogni figura direttamente dall'interfaccia: titolo, descrizione, passi, preparazione, video e così via. Clicca sulla figura e cerca il pulsante di modifica.

### Fai un backup

I dati sono salvati nel browser (localStorage) e non vanno da nessuna parte automaticamente. Per non perderli:

- Usa il pulsante **Esporta** per scaricare un file JSON con tutte le tue figure e note
- Usa **Importa** per ripristinarli su un altro dispositivo o dopo aver svuotato il browser

---

## Per chi vuole modificare il codice

### Setup locale

I moduli ES richiedono un server HTTP (non funziona aprendo il file direttamente):

```bash
python3 -m http.server 8000
# oppure
npx serve .
```

Poi apri `http://localhost:8000`.

### Deploy su GitHub Pages

1. Push su `main`
2. Vai su Settings del repo > Pages > Source: "Deploy from a branch" > Branch: `main`, cartella: `/ (root)`
3. L'app sarà disponibile su `https://<username>.github.io/dance-database/`

### Tech stack

- Vanilla JavaScript (ES modules, nessun build step)
- Tailwind CSS (CDN)
- Lucide Icons (CDN)
- Marked.js per il rendering delle risposte AI
- Service Worker per la cache offline
