import '../models/ticket.dart';
import 'api_client.dart';

class TicketService {
  TicketService(this._api);
  final ApiClient _api;

  Future<List<Ticket>> list() async {
    final data = await _api.get('/tickets');
    return (data['tickets'] as List<dynamic>)
        .map((item) => Ticket.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> create({required String title, required String description, required String priority}) async {
    await _api.post('/tickets', {'title': title, 'description': description, 'priority': priority});
  }

  Future<void> assign(String ticketId) async {
    await _api.patch('/tickets/$ticketId/assign');
  }

  Future<void> changeStatus(String ticketId, String status) async {
    await _api.patch('/tickets/$ticketId/status', {'status': status});
  }

  Future<void> close(String ticketId) async {
    await _api.patch('/tickets/$ticketId/close');
  }
}
