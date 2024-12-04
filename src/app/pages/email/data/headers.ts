import {
  NamedValue
} from 'src/app/common/types/NamedValue';
import {TemplateOptions} from 'src/app/common/types/TemplateOptions';


export const headers: NamedValue<TemplateOptions>[] = [
  {
    name: 'Imagem Grande',
    value: {
      url: 'assets/componentes/headers/headers_imagem_grande.html',
      hasImage: true,
      isInverse: false,
    },
  },
  {
    name: 'Imagem Grande Inverso',
    value: {
      url: 'assets/componentes/headers/headers_imagem_grande_inverso.html',
      hasImage: true,
      isInverse: true,
    },
  },
  {
    name: 'Imagem Pequena',
    value: {
      url: 'assets/componentes/headers/headers_imagem_pequena.html',
      hasImage: true,
      isInverse: false,
    },
  },
  {
    name: 'Imagem Pequena Inverso',
    value: {
      url: 'assets/componentes/headers/headers_imagem_pequena_inverso.html',
      hasImage: true,
      isInverse: true,
    },
  },
  {
    name: 'Sem Imagem',
    value: {
      url: 'assets/componentes/headers/headers_sem_imagem.html',
      hasImage: false,
      isInverse: false,
    },
  },
  {
    name: 'Sem Imagem Inverso',
    value: {
      url: 'assets/componentes/headers/headers_sem_imagem_inverso.html',
      hasImage: false,
      isInverse: true,
    },
  },
];
