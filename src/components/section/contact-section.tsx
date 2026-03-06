import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { Icons } from "@/components/icons";
import { MailIcon } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: DATA.contact.social.GitHub.url, icon: Icons.github },
  { name: "X / Twitter", href: DATA.contact.social.X.url, icon: Icons.x },
  { name: "YouTube", href: DATA.contact.social.Youtube.url, icon: Icons.youtube },
  { name: "Spotify", href: DATA.contact.social.Spotify.url, icon: Icons.spotify },
] as const;

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-8 relative overflow-hidden">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-2/3 overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground text-balance text-sm">
            Want to collab on music, need a website, or just want to say hi?
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 border rounded-lg p-4 hover:bg-muted transition-colors group"
            >
              <Icon className="size-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {name}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href={`mailto:${DATA.contact.email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MailIcon className="size-4" />
          {DATA.contact.email}
        </Link>
      </div>
    </div>
  );
}
