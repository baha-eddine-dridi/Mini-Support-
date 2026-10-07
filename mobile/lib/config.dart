/// URL configurable à la compilation, par exemple :
/// flutter run --dart-define=API_URL=http://192.168.1.50:4000/api
///
/// 10.0.2.2 désigne le PC hôte depuis l'émulateur Android.
const apiUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://10.0.2.2:4000/api',
);

