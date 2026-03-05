import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";

export const DATA = {
  name: "GRXTOR",
  initials: "GR",
  url: "https://grxtor.com",
  location: "Turkey",
  locationLink: "https://www.google.com/maps/place/Turkey",
  description:
    "Web Designer & Music Producer. Founder of The Lost Label — Brazilian Funk & Phonk.",
  summary:
    "I'm GRXTOR (Abdullah Hüseyin Efe), a web designer and music producer based in Turkey. I run [The Lost Label](https://thelostlabel.com), an independent music label releasing Brazilian Funk and Phonk. I design and build websites for music brands — including [thelostlabel.com](https://thelostlabel.com) and [elysianrecords.com](https://elysianrecords.com). When I'm not behind a screen, I'm producing Brazilian Funk tracks and pushing new sounds.",
  avatarUrl: "/me.png",
  skills: [
    { name: "Next.js", icon: NextjsIconDark },
    { name: "React", icon: ReactLight },
    { name: "TypeScript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "TailwindCSS" },
    { name: "Figma" },
    { name: "HTML / CSS" },
    { name: "Web Design" },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "info@grxtor.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/grxtor",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/grxtor",
        icon: Icons.linkedin,
        navbar: false,
      },
      X: {
        name: "X",
        url: "https://x.com/grxtor",
        icon: Icons.x,
        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://youtube.com/@grxtor",
        icon: Icons.youtube,
        navbar: true,
      },
      Spotify: {
        name: "Spotify",
        url: "https://open.spotify.com/artist/3Oohh6pTxKXeLNeLXgalhe",
        icon: Icons.spotify,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:info@grxtor.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "The Lost Label",
      href: "https://thelostlabel.com",
      badges: ["Founder"],
      location: "Remote",
      title: "Founder & Creative Director",
      logoUrl: "/me.png",
      start: "2023",
      end: "2026",
      description:
        "Founded and run The Lost Label, an independent music label releasing Brazilian Funk and Phonk music. Responsible for creative direction, web design, branding, and artist development. Built the full website and digital presence from scratch.",
    },
    {
      company: "Elysian Records",
      href: "https://elysianrecords.com",
      badges: [],
      location: "Remote",
      title: "Web Designer & Developer",
      logoUrl: "/me.png",
      start: "2024",
      end: "2025",
      description:
        "Designed and developed the full website for Elysian Records — a music label brand. Handled UI/UX design, frontend development, and deployment.",
    },
  ],
  education: [],
  projects: [
    {
      title: "The Lost Label",
      href: "https://thelostlabel.com",
      dates: "2026",
      active: true,
      description:
        "Independent music label I founded, focused on Brazilian Funk and Phonk. Designed and built the complete website and brand identity from the ground up.",
      technologies: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Web Design",
        "Branding",
      ],
      links: [
        {
          type: "Website",
          href: "https://thelostlabel.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Elysian Records",
      href: "https://elysianrecords.com",
      dates: "2025",
      active: true,
      description:
        "Full website design and development for Elysian Records. Built a clean, modern music label site with a focus on brand identity and user experience.",
      technologies: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Web Design",
      ],
      links: [
        {
          type: "Website",
          href: "https://elysianrecords.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],
  hackathons: [],
} as const;
