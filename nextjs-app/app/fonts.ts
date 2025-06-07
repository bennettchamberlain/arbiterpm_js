import localFont from 'next/font/local';

export const alteHaasGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/alte_haas_grotesk/AlteHaasGroteskRegular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/alte_haas_grotesk/AlteHaasGroteskBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-alteHaasGrotesk',
  display: 'swap',
}); 