import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props}
            src="/app-logo.png" 
            alt="Hamasense Logo"
            className="w-14 h-14 object-contain"
        />

    );
}