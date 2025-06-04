import localFont from 'next/font/local';

export const nohemi = localFont({
  src: [
    {
      path: '../public/fonts/nohemi/Nohemi-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/nohemi/Nohemi-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-nohemi',
}); 