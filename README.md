# DAO Smart Contract

## Introduzione

Il nostro contratto DAO offre agli utenti l'opportunità di partecipare attivamente alle decisioni e alla governance della nostra piattaforma decentralizzata. Con la detenzione di azioni e il voto su proposte, gli utenti diventano membri chiave del nostro ecosistema, contribuendo direttamente alla sua crescita e sviluppo. La trasparenza e la partecipazione sono valori fondamentali su cui è costruita la nostra DAO. Con il nostro contratto, gli utenti possono acquistare azioni per partecipare alla governance e proporsi come amministratori della piattaforma. Le proposte possono riguardare una vasta gamma di argomenti, e ogni membro può esprimere il proprio voto, garantendo che le decisioni riflettano il vero consenso della comunità.

## Scopo

Il contratto DAO consente ai membri di acquistare azioni della DAO in cambio di token ERC-20, proporre decisioni, votare su proposte e approvare decisioni in base alla maggioranza dei voti.

## Funzionalità Principali

1. **Acquisto di Azioni**: Gli utenti possono acquistare azioni della DAO utilizzando token ERC-20 a un prezzo determinato.

2. **Proposizione di Decisioni**: I membri possono proporre decisioni che vengono sottoposte al voto della comunità.

3. **Votazione sulle Proposte**: I membri possono votare per o contro le decisioni proposte.

4. **Approvazione delle Decisioni**: Le decisioni che ricevono la maggioranza dei voti vengono approvate e eseguite.

## Esempi di Utilizzo

### Acquisto di Azioni

```solidity
// Acquisto di 10 azioni della DAO
await dao.buyShares(10);
```

### Proposizione di Decisioni

```solidity
// Proposizione di una nuova decisione
await dao.createProposal("Titolo della Proposta", "Descrizione della Proposta", indirizzoDestinatario, quantità);
```

### Votazione sulle Proposte

```solidity
// Votazione per una proposta
await dao.vote(idProposta, true, false); // Voto PRO
await dao.vote(idProposta, false, false); // Voto CONTRO
await dao.vote(idProposta, false, true); // Astensione dal voto
```

### Esecuzione delle Decisioni

```solidity
// Esecuzione di una decisione
await dao.executeProposal(idProposta);
```

### Avvio del Contratto
Prima di utilizzare il contratto, assicurati di aver impostato correttamente i parametri del token ERC-20 e il prezzo delle azioni durante la fase di inizializzazione.

```solidity
// Imposta il token ERC-20 e il prezzo delle azioni durante la fase di inizializzazione
const dao = await Dao.deploy(token.address, prezzoAzioni);
```