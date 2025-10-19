import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center mr-2 justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon/>
            </div>
            <div className="grid flex-1 text-left text-sm">
                <h4 className="truncate leading-tight font-bold font-logo text-xl">
                    HAMASENSE
                </h4>
            </div>
        </>
    );
}