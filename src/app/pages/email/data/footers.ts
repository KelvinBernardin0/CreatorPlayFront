import { ColorScheme, NamedValue } from 'src/app/common/types/NamedValue';
import { TemplateOptions } from 'src/app/common/types/TemplateOptions';

export const footers: NamedValue<TemplateOptions>[] = [
  {
    name: 'Padrão',
    value: {
      hasImage: false,
      url: 'assets/componentes/footers/footer.html',
      isInverse: false,
    },
  },
  {
    name: 'Inverso',
    value: {
      hasImage: false,
      url: 'assets/componentes/footers/footer_inverso.html',
      isInverse: true,
    },
  },
];
