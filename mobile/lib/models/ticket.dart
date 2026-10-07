class TicketPerson {
  const TicketPerson({required this.id, required this.name, required this.email});

  final String id;
  final String name;
  final String email;

  factory TicketPerson.fromJson(Map<String, dynamic> json) => TicketPerson(
        id: json['_id'] as String,
        name: json['name'] as String,
        email: json['email'] as String,
      );
}

class Ticket {
  const Ticket({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    required this.creator,
    required this.assignedAgent,
    required this.createdAt,
  });

  final String id;
  final String title;
  final String description;
  final String priority;
  final String status;
  final TicketPerson creator;
  final TicketPerson? assignedAgent;
  final DateTime createdAt;

  factory Ticket.fromJson(Map<String, dynamic> json) => Ticket(
        id: json['_id'] as String,
        title: json['title'] as String,
        description: json['description'] as String,
        priority: json['priority'] as String,
        status: json['status'] as String,
        creator: TicketPerson.fromJson(json['creator'] as Map<String, dynamic>),
        assignedAgent: json['assignedAgent'] == null
            ? null
            : TicketPerson.fromJson(json['assignedAgent'] as Map<String, dynamic>),
        createdAt: DateTime.parse(json['createdAt'] as String),
      );
}

