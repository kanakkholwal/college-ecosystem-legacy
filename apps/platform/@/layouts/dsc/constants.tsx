import localFont from 'next/font/local';

export const productSans = localFont({
    src: [
        {
            path: './assets/fonts/Product Sans Regular.ttf',
            weight: '400',
            style: 'normal'
        },
        {
            path: './assets/fonts/Product Sans Bold.ttf',
            weight: '700',
            style: 'normal'
        },
        {
            path: './assets/fonts/Product Sans Italic.ttf',
            weight: '400',
            style: 'italic'
        },
        {
            path: './assets/fonts/Product Sans Bold Italic.ttf',
            weight: '700',
            style: 'italic'
        }
    ]
});
