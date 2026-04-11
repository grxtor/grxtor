import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { getProfile, getWork, getSkills } from "@/lib/data";

// Icon mapping for skills (by name)
const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js": NextjsIconDark,
  "React": ReactLight,
  "TypeScript": Typescript,
  "Node.js": Nodejs,
};

// Icon mapping for social links
const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Icons.github,
  LinkedIn: Icons.linkedin,
  X: Icons.x,
  Youtube: Icons.youtube,
  Spotify: Icons.spotify,
  email: Icons.email,
};

export async function getDATA() {
  const profile = await getProfile();
  const work = await getWork();
  const skills = await getSkills();

  return {
    name: profile.name,
    realName: profile.realName,
    initials: profile.initials,
    url: profile.url,
    location: profile.location,
    locationLink: profile.locationLink,
    description: profile.description,
    summary: profile.summary,
    avatarUrl: profile.avatarUrl,
    skills: skills.map((name) => ({
      name,
      icon: skillIconMap[name] || undefined,
    })),
    navbar: [
      { href: "/", icon: HomeIcon, label: "Home" },
      { href: "/blog", icon: NotebookIcon, label: "Blog" },
    ],
    contact: {
      email: profile.email,
      tel: "",
      social: Object.fromEntries(
        Object.entries(profile.social).map(([name, data]) => [
          name,
          {
            name,
            url: data.url,
            icon: socialIconMap[name] || Icons.globe,
            navbar: data.navbar,
          },
        ])
      ),
    },
    work: work.map((w) => ({
      ...w,
      end: w.end || undefined,
    })),
    education: [],
    projects: [],
    hackathons: [],
    spotifyArtistId: profile.spotifyArtistId,
  };
}

