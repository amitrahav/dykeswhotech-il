import logos from "../assets/sponsors/logos.png";

export function Sponsors() {
    return (
        <section className="py-16 px-8 text-center relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #FEECFF 0%, #FECAFF 11.71%, #FEB5FF 26.8%, #FFDBE7 40.18%, #FFF4D6 49.22%, #F3FCD7 58.71%, #D2F5EE 71.29%, #C3EFFF 84.44%, #FBEFFF 100%)' }}>
            <img src={logos} alt="Sponsors" className="mx-auto max-w-full h-auto" />
        </section>
    );
}