import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/ticket.dart';
import '../services/api_client.dart';
import '../services/ticket_service.dart';
import '../state/auth_controller.dart';
import '../widgets/ticket_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late final TicketService _tickets;
  late Future<List<Ticket>> _futureTickets;

  @override
  void initState() {
    super.initState();
    _tickets = TicketService(context.read<AuthController>().apiClient);
    _futureTickets = _tickets.list();
  }

  void _reload() => setState(() => _futureTickets = _tickets.list());

  Future<void> _withFeedback(Future<void> Function() action) async {
    try {
      await action();
      _reload();
    } on ApiException catch (error) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    } catch (_) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Une erreur est survenue.')));
    }
  }

  Future<void> _showCreateTicket() async {
    final created = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (_) => _CreateTicketSheet(service: _tickets),
    );
    if (created == true) _reload();
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthController>().user!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mini Support+'),
        actions: [IconButton(tooltip: 'Déconnexion', onPressed: () => context.read<AuthController>().logout(), icon: const Icon(Icons.logout))],
      ),
      floatingActionButton: user.isAgent ? null : FloatingActionButton.extended(onPressed: _showCreateTicket, icon: const Icon(Icons.add), label: const Text('Nouveau ticket')),
      body: RefreshIndicator(
        onRefresh: () async {
          _reload();
          await _futureTickets;
        },
        child: FutureBuilder<List<Ticket>>(
          future: _futureTickets,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
            if (snapshot.hasError) {
              final message = snapshot.error is ApiException ? (snapshot.error! as ApiException).message : 'Impossible de charger les tickets.';
              return ListView(children: [Padding(padding: const EdgeInsets.all(30), child: Center(child: Text(message)))]);
            }
            final tickets = snapshot.data ?? [];
            return ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 90),
              children: [
                Text(user.isAgent ? 'Tickets à traiter' : 'Mes tickets', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 5),
                Text(user.isAgent ? 'Triés par priorité puis ancienneté.' : 'Suivez vos demandes de support.'),
                const SizedBox(height: 20),
                if (tickets.isEmpty) const Padding(padding: EdgeInsets.only(top: 40), child: Center(child: Text('Aucun ticket pour le moment.'))),
                ...tickets.map((ticket) => TicketCard(
                      ticket: ticket,
                      isAgent: user.isAgent,
                      currentUser: user,
                      onAssign: () => _withFeedback(() => _tickets.assign(ticket.id)),
                      onNextStatus: (status) => _withFeedback(() => _tickets.changeStatus(ticket.id, status)),
                      onClose: () => _withFeedback(() => _tickets.close(ticket.id)),
                    )),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _CreateTicketSheet extends StatefulWidget {
  const _CreateTicketSheet({required this.service});
  final TicketService service;

  @override
  State<_CreateTicketSheet> createState() => _CreateTicketSheetState();
}

class _CreateTicketSheetState extends State<_CreateTicketSheet> {
  final _formKey = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _description = TextEditingController();
  String _priority = 'MEDIUM';
  bool _saving = false;
  String? _error;

  @override
  void dispose() { _title.dispose(); _description.dispose(); super.dispose(); }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _saving = true; _error = null; });
    try {
      await widget.service.create(title: _title.text.trim(), description: _description.text.trim(), priority: _priority);
      if (mounted) Navigator.pop(context, true);
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    } finally { if (mounted) setState(() => _saving = false); }
  }

  @override
  Widget build(BuildContext context) => Padding(
        padding: EdgeInsets.fromLTRB(20, 22, 20, MediaQuery.viewInsetsOf(context).bottom + 22),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Nouvelle demande', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 18),
              TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Titre'), validator: (value) => value == null || value.trim().length < 3 ? '3 caractères minimum' : null),
              const SizedBox(height: 14),
              TextFormField(controller: _description, minLines: 3, maxLines: 5, decoration: const InputDecoration(labelText: 'Description'), validator: (value) => value == null || value.trim().length < 3 ? '3 caractères minimum' : null),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(initialValue: _priority, decoration: const InputDecoration(labelText: 'Priorité'), items: const ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(), onChanged: (value) => setState(() => _priority = value!)),
              if (_error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
              const SizedBox(height: 20),
              FilledButton(onPressed: _saving ? null : _submit, child: Text(_saving ? 'Création…' : 'Créer le ticket')),
            ],
          ),
        ),
      );
}
