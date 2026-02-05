"use client";

import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookF, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/components/footer.css";
export default function Footer() {
  const t = useTranslate();

  return (
    <footer>
      {/* Background */}
      <Image
        src="/footer-bg1.png"
        alt="Footer Background"
        fill
        className="footer-bg"
      />

      {/* Description */}
      <p className="paragraph">{t.footer.description}</p>

      <div className="container">
        {/* Logo */}
        <Image className="logo" src="/logo.png" alt="Masr360 Logo" fill />

        <div className="hold">
          {/* Contact */}
          <div className="about">
            <h4>{t.footer.contact_title}</h4>
            <p>
              {t.footer.email_label}:{" "}
              <a href="mailto:info@masr360.com">info@masr360.com</a>
            </p>
            <p>
              {t.footer.phone_label}:{" "}
              <a href="tel:+201101512242" dir="ltr">+20 110 151 2242</a>
            </p>
          </div>

          {/* Social */}
          <div className="social">
            <h4>{t.footer.social_title}</h4>
            <div className="holder">
              <a
                href="https://www.instagram.com/masr360.eg/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/masr360%C2%B0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.facebook.com/Masr360e/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.tiktok.com/@masr360.travel/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="navlinks">
          <h4>{t.footer.quick_links}</h4>
          <ul>
            <li>
              <Link href="/">{t.footer.links.home}</Link>
            </li>
            <li>
              <Link href="/governorates">{t.footer.links.governorates}</Link>
            </li>
            <li>
              <Link href="/places">{t.footer.links.places}</Link>
            </li>
            <li>
              <Link href="/products">{t.footer.links.products}</Link>
            </li>
            <li>
              <Link href="/contact">{t.footer.links.contact}</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Rights */}
      <p className="privacy">
        © {new Date().getFullYear()} Masr360. {t.footer.rights} |{" "}
        <Link href="/privacy" className="privacy-link">
          {t.footer.privacy}
        </Link>
      </p>
    </footer>
  );
}
