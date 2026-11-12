//src/components/Footer.tsx
"use client";

import { siInstagram, siFacebook, siYoutube } from "simple-icons";

export default function Footer() {
    const ano = new Date().getFullYear();
    const empresa = "Bood Accessoria"

    const InstagramIcon = () => (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: siInstagram.svg }}
        />
    );

    const FacebookIcon = () => (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: siFacebook.svg }}
        />
    );

    const YoutubeIcon = () => (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: siYoutube.svg }}
        />
    );

    return (
        <footer className="bg-primary-800 text-white">
            <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
                {/* Ícones das redes sociais */}
                <div className="flex gap-4">
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="transition-colors hover:text-amber-300"
                    >
                        <InstagramIcon />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="transition-colors hover:text-amber-300"
                    >
                        <FacebookIcon />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="transition-colors hover:text-amber-300"
                    >
                        <YoutubeIcon />
                    </a>
                    {/* <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="transition-colors hover:text-amber-300"
                    >
                        <Linkedin size={24} />
                    </a> */}
                </div>

                {/* Texto de copyright */}
                <div className="text-center text-sm">Copyright © {ano} {empresa}. Todos os direitos reservados.</div>
            </div>
        </footer>
    );
}