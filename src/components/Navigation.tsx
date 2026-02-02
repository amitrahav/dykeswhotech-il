import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

export function Navigation() {
    const { content } = useContent();
    const { navigation, footer } = content.common;

    return (
        <nav
            className="w-full h-[55px] flex items-center justify-center gap-6 text-xs font-medium text-gray-500"
            style={{ background: 'linear-gradient(-90deg, #FEECFF 0%, #FECAFF 11.71%, #FEB5FF 26.8%, #FFDBE7 40.18%, #FFF4D6 49.22%, #F3FCD7 58.71%, #D2F5EE 71.29%, #C3EFFF 84.44%, #FBEFFF 100%)' }}
        >
            <Link to="/" className="hover:text-gray-900 transition-colors">{navigation.home}</Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">{navigation.about}</Link>
            <span>{navigation.contact} <a href={`mailto:${footer.email}`} className="hover:text-gray-900 transition-colors">{footer.email}</a></span>
        </nav>
    );
}
