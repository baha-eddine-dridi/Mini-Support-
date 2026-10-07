import 'package:flutter/material.dart';

import '../models/ticket.dart';
import '../models/user.dart';

class TicketCard extends StatelessWidget {
  const TicketCard({
    super.key,
    required this.ticket,
    required this.isAgent,
    required this.currentUser,
    required this.onAssign,
    required this.onNextStatus,
    required this.onClose,
  });

  final Ticket ticket;
  final bool isAgent;
  final AppUser? currentUser;
  final Future<void> Function() onAssign;
  final Future<void> Function(String nextStatus) onNextStatus;
  final Future<void> Function() onClose;

  Color get _priorityColor => switch (ticket.priority) {
        'URGENT' => Colors.red,
        'HIGH' => Colors.deepOrange,
        'MEDIUM' => Colors.amber.shade800,
        _ => Colors.green,
      };

  String? get _nextStatus => switch (ticket.status) {
        'OPEN' => 'IN_PROGRESS',
        'IN_PROGRESS' => 'RESOLVED',
        _ => null,
      };

  String get _nextLabel => _nextStatus == 'IN_PROGRESS' ? 'Démarrer le traitement' : 'Marquer comme résolu';
  
  bool get _canClose => !isAgent && currentUser?.id == ticket.creator.id && ticket.status == 'OPEN';

  @override
  Widget build(BuildContext context) => Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  _Tag(ticket.priority, _priorityColor),
                  const Spacer(),
                  _Tag(_statusLabel(ticket.status), Colors.blueGrey),
                ],
              ),
              const SizedBox(height: 12),
              Text(ticket.title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 7),
              Text(ticket.description),
              const Divider(height: 28),
              Text('Créé par : ${ticket.creator.name}', style: Theme.of(context).textTheme.bodySmall),
              Text('Agent : ${ticket.assignedAgent?.name ?? 'Non attribué'}', style: Theme.of(context).textTheme.bodySmall),
              if (isAgent) ...[
                const SizedBox(height: 14),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    if (ticket.assignedAgent == null)
                      OutlinedButton(onPressed: () => onAssign(), child: const Text("S'attribuer")),
                    if (_nextStatus != null)
                      FilledButton(onPressed: () => onNextStatus(_nextStatus!), child: Text(_nextLabel)),
                  ],
                ),
              ],
              if (_canClose) ...[
                const SizedBox(height: 14),
                OutlinedButton(onPressed: () => onClose(), child: const Text('Fermer ce ticket')),
              ],
            ],
          ),
        ),
      );
}

class _Tag extends StatelessWidget {
  const _Tag(this.text, this.color);
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(color: color.withValues(alpha: .13), borderRadius: BorderRadius.circular(20)),
        child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 11)),
      );
}

String _statusLabel(String status) => switch (status) {
      'OPEN' => 'OUVERT',
      'IN_PROGRESS' => 'EN COURS',
      'RESOLVED' => 'RÉSOLU',
      'CLOSED' => 'FERMÉ',
      _ => status,
    };
