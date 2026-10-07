# Fonctionnalité : Fermeture de tickets par l'utilisateur

## 📋 Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de **fermer leurs propres tickets** lorsqu'ils sont encore au statut `OPEN`. Cela améliore l'autonomie des utilisateurs et réduit la charge de travail des agents.

## 🎯 Cas d'usage

### Scénario 1 : Problème résolu seul
Un utilisateur crée un ticket pour un problème, puis trouve la solution par lui-même. Il peut maintenant fermer le ticket immédiatement sans attendre qu'un agent le traite.

### Scénario 2 : Demande annulée
Un utilisateur crée un ticket par erreur ou change d'avis. Il peut annuler sa demande en fermant le ticket.

### Scénario 3 : Doublon
Un utilisateur crée accidentellement deux tickets pour le même problème. Il peut fermer le doublon.

## 🔧 Implémentation technique

### Backend

#### 1. Nouveau statut `CLOSED`
- Ajouté aux statuts possibles : `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- Statut terminal (aucune transition possible depuis `CLOSED`)

#### 2. Transitions mises à jour
```typescript
const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],  // ✅ User peut OPEN → CLOSED
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CLOSED: []
};
```

#### 3. Nouvelle route API
```
PATCH /api/tickets/:id/close
Authorization: Bearer <token>
Role: user
```

#### 4. Règles de sécurité
- ✅ Seul le créateur du ticket peut le fermer
- ✅ Seuls les tickets au statut `OPEN` peuvent être fermés par un user
- ✅ Les tickets `IN_PROGRESS` ou `RESOLVED` ne peuvent pas être fermés par un user

#### 5. Code du service
```typescript
export async function closeUserTicket(ticketId: string, userId: string) {
  validId(ticketId);
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new AppError(404, 'Ticket not found');
  
  // Only the creator can close their own ticket
  if (ticket.creator.toString() !== userId) {
    throw new AppError(403, 'You can only close your own tickets');
  }
  
  // Only OPEN tickets can be closed by users
  if (ticket.status !== 'OPEN') {
    throw new AppError(400, 'Only open tickets can be closed');
  }
  
  ticket.status = 'CLOSED';
  await ticket.save();
  return ticket.populate(populatedTicket);
}
```

### Frontend Web (React)

#### 1. Nouveau bouton "Fermer ce ticket"
Visible uniquement pour :
- Les utilisateurs (pas les agents)
- Sur leurs propres tickets
- Quand le ticket est au statut `OPEN`

#### 2. Fonction de fermeture
```typescript
async function closeTicket(id: string): Promise<void> {
  try { 
    await api.patch(`/tickets/${id}/close`); 
    await loadTickets(); 
  }
  catch (err) { 
    setError(readableError(err)); 
  }
}
```

#### 3. Style CSS
Nouveau style pour le badge `CLOSED` :
```css
.status-closed { 
  color: #5a6b6f; 
  background: #e8eeef; 
}
```

### Mobile (Flutter)

#### 1. Mise à jour du service
```dart
Future<void> close(String ticketId) async {
  await _api.patch('/tickets/$ticketId/close');
}
```

#### 2. Widget TicketCard mis à jour
- Détection automatique : utilisateur créateur + statut `OPEN`
- Affichage du bouton "Fermer ce ticket"
- Appel de la fonction `onClose()` lors du clic

#### 3. Label de statut
```dart
String _statusLabel(String status) => switch (status) {
  'OPEN' => 'OUVERT',
  'IN_PROGRESS' => 'EN COURS',
  'RESOLVED' => 'RÉSOLU',
  'CLOSED' => 'FERMÉ',
  _ => status,
};
```

## 📊 Workflow des statuts

### Avant la fonctionnalité
```
OPEN → IN_PROGRESS → RESOLVED
```

### Après la fonctionnalité
```
OPEN → IN_PROGRESS → RESOLVED
  ↓
CLOSED (accessible uniquement au créateur)
```

## 🔒 Sécurité

### Contrôles implémentés
1. ✅ **Authentification** : JWT requis
2. ✅ **Autorisation** : Rôle `user` requis
3. ✅ **Propriété** : Vérification que l'utilisateur est le créateur
4. ✅ **État** : Seuls les tickets `OPEN` peuvent être fermés
5. ✅ **Validation** : ID de ticket valide

### Messages d'erreur
- `401` : "Authentication required" (pas de JWT)
- `403` : "You can only close your own tickets" (pas le créateur)
- `404` : "Ticket not found" (ID invalide)
- `400` : "Only open tickets can be closed" (statut incorrect)

## 📈 Avantages

### Pour les utilisateurs
- ✅ **Autonomie** : Peuvent gérer leurs propres tickets
- ✅ **Rapidité** : Pas besoin d'attendre un agent pour annuler
- ✅ **Contrôle** : Sentiment de maîtrise sur leurs demandes

### Pour les agents
- ✅ **Moins de bruit** : Tickets obsolètes automatiquement fermés
- ✅ **Concentration** : File de travail plus pertinente
- ✅ **Efficacité** : Gain de temps significatif

### Pour l'entreprise
- ✅ **Métriques** : Taux d'auto-résolution mesurable
- ✅ **Coûts** : Réduction de la charge support
- ✅ **Satisfaction** : Meilleure expérience utilisateur

## 🧪 Tests manuels

### Scénario de test 1 : Fermeture normale
1. Se connecter comme utilisateur
2. Créer un ticket
3. Vérifier que le bouton "Fermer ce ticket" apparaît
4. Cliquer sur le bouton
5. ✅ Le ticket passe au statut `CLOSED`

### Scénario de test 2 : Sécurité - Autre utilisateur
1. Utilisateur A crée un ticket
2. Utilisateur B se connecte
3. Utilisateur B essaie de fermer le ticket de A via API
4. ✅ Erreur 403 : "You can only close your own tickets"

### Scénario de test 3 : Sécurité - Mauvais statut
1. Agent prend en charge un ticket (statut → `IN_PROGRESS`)
2. Créateur essaie de fermer le ticket via API
3. ✅ Erreur 400 : "Only open tickets can be closed"

### Scénario de test 4 : Interface - Visibilité bouton
1. Se connecter comme utilisateur
2. Voir un ticket `OPEN` → ✅ Bouton visible
3. Voir un ticket `IN_PROGRESS` → ✅ Bouton invisible
4. Voir un ticket `RESOLVED` → ✅ Bouton invisible

### Scénario de test 5 : Agent ne voit pas le bouton
1. Se connecter comme agent
2. ✅ Le bouton "Fermer ce ticket" n'apparaît jamais

## 📝 Documentation mise à jour

### README.md
- ✅ Ajouté dans la section "Fonctionnalités"
- ✅ Nouvelle route dans le tableau API
- ✅ Exemple d'utilisation de la route
- ✅ Mention dans "Choix sécurité et performance"

## ✨ Améliorations futures possibles

### Court terme
- [ ] Ajouter un message de confirmation avant fermeture
- [ ] Notification à l'agent si un ticket assigné est fermé
- [ ] Statistiques : nombre de tickets auto-fermés

### Moyen terme
- [ ] Permettre de rouvrir un ticket `CLOSED`
- [ ] Ajouter un commentaire obligatoire lors de la fermeture
- [ ] Historique des changements de statut

### Long terme
- [ ] Analyse ML : prédire les tickets qui seront auto-fermés
- [ ] Suggérer automatiquement la fermeture après X jours sans activité
- [ ] Badges utilisateur : "résout ses problèmes seul"

## 📅 Date d'implémentation
7 octobre 2026

## 👥 Impact
- Backend : 4 fichiers modifiés
- Frontend Web : 4 fichiers modifiés
- Mobile Flutter : 3 fichiers modifiés
- Documentation : 2 fichiers modifiés

---

**Status** : ✅ Implémenté et testé avec succès
