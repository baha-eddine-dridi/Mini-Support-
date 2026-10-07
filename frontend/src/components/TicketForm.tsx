import { useState, type FormEvent } from 'react';
import type { Priority } from '../types';

interface Props {
  onSubmit: (values: { title: string; description: string; priority: Priority }) => Promise<void>;
}

export function TicketForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="ticket-form" onSubmit={submit}>
      <label>Titre<input required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Impossible de me connecter" /></label>
      <label>Description<textarea required minLength={3} maxLength={4000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre demande…" rows={5} /></label>
      <label>Priorité
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="LOW">Basse</option><option value="MEDIUM">Moyenne</option><option value="HIGH">Haute</option><option value="URGENT">Urgente</option>
        </select>
      </label>
      <button className="button" disabled={saving}>{saving ? 'Envoi…' : 'Créer le ticket'}</button>
    </form>
  );
}

