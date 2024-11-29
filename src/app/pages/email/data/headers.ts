import {
  ColorScheme,
  NamedValue,
  Image,
} from 'src/app/common/types/NamedValue';

export const headers: (NamedValue<string> & Image & ColorScheme)[] = [
  {
    name: 'Imagem Grande',
    value: 'assets/componentes/headers/headers_imagem_grande.html',
    hasImage: true,
    isInverse: false,
  },
  {
    name: 'Imagem Grande Inverso',
    value: 'assets/componentes/headers/headers_imagem_grande_inverso.html',
    hasImage: true,
    isInverse: true,
  },
  {
    name: 'Imagem Pequena',
    value: 'assets/componentes/headers/headers_imagem_pequena.html',
    hasImage: true,
    isInverse: false,
  },
  {
    name: 'Imagem Pequena Inverso',
    value: 'assets/componentes/headers/headers_imagem_pequena_inverso.html',
    hasImage: true,
    isInverse: true,
  },
  {
    name: 'Sem Imagem',
    value: 'assets/componentes/headers/headers_sem_imagem.html',
    hasImage: false,
    isInverse: false,
  },
  {
    name: 'Sem Imagem Inverso',
    value: 'assets/componentes/headers/headers_sem_imagem_inverso.html',
    hasImage: false,
    isInverse: true,
  },
];
