import { ColorScheme, NamedValue } from 'src/app/common/types/NamedValue';

export const footers: (NamedValue<string> & ColorScheme)[] = [
  {
    name: 'Padrão',
    value: 'assets/componentes/footers/footer.html',
    isInverse: false,
  },
  {
    name: 'Inverso',
    value: 'assets/componentes/footers/footer_inverso.html',
    isInverse: true,
  },
];
