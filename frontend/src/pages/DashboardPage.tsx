import { useEffect, useState } from 'react';
import { api, readableError } from '../api/client';
import { TicketCard } from '../components/TicketCard';
import { TicketForm } from '../components/TicketForm';
import { useAuth } from '../context/AuthContext';
import type { Priority, Ticket, TicketStatus } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAgent = user?.role === 'agent';

  async function loadTickets(): Promise<void> {
    setLoading(true);
    try { const { data } = await api.get('/tickets'); setTickets(data.tickets); setError(''); }
    catch (err) { setError(readableError(err)); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadTickets(); }, []);

  async function createTicket(values: { title: string; description: string; priority: Priority }): Promise<void> {
    try { await api.post('/tickets', values); await loadTickets(); }
    catch (err) { setError(readableError(err)); }
  }
  async function assign(id: string): Promise<void> {
    try { await api.patch(`/tickets/${id}/assign`); await loadTickets(); }
    catch (err) { setError(readableError(err)); }
  }
  async function updateStatus(id: string, status: TicketStatus): Promise<void> {
    try { await api.patch(`/tickets/${id}/status`, { status }); await loadTickets(); }
    catch (err) { setError(readableError(err)); }
  }
  async function closeTicket(id: string): Promise<void> {
    try { await api.patch(`/tickets/${id}/close`); await loadTickets(); }
    catch (err) { setError(readableError(err)); }
  }

  return (
    <section className="dashboard">
      <div className="page-intro">
        <div><p className="eyebrow">{isAgent ? 'ESPACE AGENT' : 'ESPACE UTILISATEUR'}</p><h1>{isAgent ? 'Tickets à traiter' : 'Mes demandes de support'}</h1><p className="muted">{isAgent ? 'Les demandes urgentes et les plus anciennes apparaissent en premier.' : 'Créez et suivez vos demandes en un seul endroit.'}</p></div>
        <span className="count">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
      </div>
      {error && <p className="error page-error">{error}</p>}
      {!isAgent && <section className="new-ticket"><h2>Nouvelle demande</h2><TicketForm onSubmit={createTicket} /></section>}
      <section className="ticket-list">
        <h2>{isAgent ? 'File de support' : 'Historique'}</h2>
        {loading ? <p className="muted">Chargement des tickets…</p> : tickets.length === 0 ? <div className="empty-state">Aucun ticket pour le moment.</div> : tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} agentView={isAgent} onAssign={assign} onStatus={updateStatus} onClose={closeTicket} />)}
      </section>
    </section>
  );
}

