import { Link } from "react-router-dom";

export function Navigation() {
    return (
        <nav
            className="w-full h-[55px] flex items-center justify-center gap-6 text-xs font-medium text-gray-500"
            style={{ background: 'linear-gradient(-90deg, #FEECFF 0%, #FECAFF 11.71%, #FEB5FF 26.8%, #FFDBE7 40.18%, #FFF4D6 49.22%, #F3FCD7 58.71%, #D2F5EE 71.29%, #C3EFFF 84.44%, #FBEFFF 100%)' }}
        >
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <span>Contact Us on <a href="mailto:info@dykeathon.com" className="hover:text-gray-900 transition-colors">info@dykeathon.com</a></span>
        </nav>
    );
}
