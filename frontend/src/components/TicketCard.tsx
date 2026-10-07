import { useAuth } from '../context/AuthContext';
import type { Ticket, TicketStatus } from '../types';

const labels: Record<TicketStatus, string> = { OPEN: 'Ouvert', IN_PROGRESS: 'En cours', RESOLVED: 'Résolu', CLOSED: 'Fermé' };

interface Props {
  ticket: Ticket;
  agentView: boolean;
  onAssign: (id: string) => Promise<void>;
  onStatus: (id: string, status: TicketStatus) => Promise<void>;
  onClose?: (id: string) => Promise<void>;
}

export function TicketCard({ ticket, agentView, onAssign, onStatus, onClose }: Props) {
  const { user } = useAuth();
  const nextStatus: Partial<Record<TicketStatus, TicketStatus>> = { OPEN: 'IN_PROGRESS', IN_PROGRESS: 'RESOLVED' };
  const next = nextStatus[ticket.status];
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ticket.createdAt));
  
  // User can close their own OPEN tickets
  const isCreator = user?.id === ticket.creator._id;
  const canClose = !agentView && isCreator && ticket.status === 'OPEN' && onClose;

  return (
    <article className="ticket-card">
      <div className="ticket-heading">
        <div><span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span><h3>{ticket.title}</h3></div>
        <span className={`status status-${ticket.status.toLowerCase()}`}>{labels[ticket.status]}</span>
      </div>
      <p>{ticket.description}</p>
      <dl className="ticket-meta">
        <div><dt>Créé par</dt><dd>{ticket.creator.name}</dd></div>
        <div><dt>Créé le</dt><dd>{date}</dd></div>
        <div><dt>Agent</dt><dd>{ticket.assignedAgent?.name ?? 'Non attribué'}</dd></div>
      </dl>
      {agentView && (
        <div className="ticket-actions">
          {!ticket.assignedAgent && <button className="button button-outline" onClick={() => void onAssign(ticket._id)}>S'attribuer</button>}
          {next && <button className="button" onClick={() => void onStatus(ticket._id, next)}>{next === 'IN_PROGRESS' ? 'Démarrer le traitement' : 'Marquer comme résolu'}</button>}
        </div>
      )}
      {canClose && (
        <div className="ticket-actions">
          <button className="button button-outline" onClick={() => void onClose(ticket._id)}>Fermer ce ticket</button>
        </div>
      )}
    </article>
  );
}
