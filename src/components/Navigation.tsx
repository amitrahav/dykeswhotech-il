import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

interface NavigationProps {
    variant?: 'gradient' | 'transparent';
    empty?: boolean;
    text?: 'bright' | 'dark';
}

export function Navigation({ variant = 'gradient', empty = false, text = 'dark' }: NavigationProps) {
    const { content } = useContent();
    const { navigation } = content.common;

    const backgroundStyle = variant === 'gradient'
        ? { background: 'linear-gradient(-90deg, #FEECFF 0%, #FECAFF 11.71%, #FEB5FF 26.8%, #FFDBE7 40.18%, #FFF4D6 49.22%, #F3FCD7 58.71%, #D2F5EE 71.29%, #C3EFFF 84.44%, #FBEFFF 100%)' }
        : { background: 'transparent' };

    return (
        <nav
            className="w-full h-[55px] flex items-center justify-center gap-6 text-lg font-medium"
            style={backgroundStyle}
        >
            {!empty && (
                <>
                    <Link to="/" className={`hover:text-primary hover:border-b-[2px] hover:pb-0 transition-colors ${text === 'bright' ? 'text-white' : 'text-primary pb-1 border-b-[1px] border-black'}`}>{navigation.home}</Link>
                    <span className={`hidden sm:inline-block w-[3px] h-[3px] rounded-full ${text === 'bright' ? 'bg-white' : 'bg-primary'}`}></span>
                    <Link to="/about" className={`hover:text-primary hover:border-b-[2px] hover:pb-0 transition-colors ${text === 'bright' ? 'text-white' : 'text-primary pb-1 border-b-[1px] border-black'}`}>{navigation.about}</Link>
                    <span className={`hidden sm:inline-block w-[3px] h-[3px] rounded-full ${text === 'bright' ? 'bg-white' : 'bg-primary'}`}></span>
                    <Link to="/sponsorship" className={`hover:text-primary hover:border-b-[2px] hover:pb-0 transition-colors ${text === 'bright' ? 'text-white' : 'text-primary pb-1 border-b-[1px] border-black'}`}>{navigation.sponsorship}</Link>
                    <span className={`hidden sm:inline-block w-[3px] h-[3px] rounded-full ${text === 'bright' ? 'bg-white' : 'bg-primary'}`}></span>
                    <Link to="/#events" className={`hover:text-primary hover:border-b-[2px] hover:pb-0 transition-colors ${text === 'bright' ? 'text-white' : 'text-primary pb-1 border-b-[1px] border-black'}`}>{navigation.eventsandspaces}</Link>
                </>
            )}
        </nav>
    );
}
