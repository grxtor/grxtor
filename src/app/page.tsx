/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDATA } from "@/data/resume";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { SpotifyWidget } from "@/components/spotify-widget";

const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
  const DATA = await getDATA();

  const jsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://grxtor.com/#person",
      name: "Abdullah Hüseyin Efe",
      alternateName: [
        "GRXTOR",
        "grxtor",
        "Abdullah Huseyin Efe",
        "Abdullah Efe",
        "Abdullah H. Efe",
        "A. Hüseyin Efe",
        "Hüseyin Efe",
        "Huseyin Efe",
      ],
      givenName: "Abdullah",
      additionalName: "Hüseyin",
      familyName: "Efe",
      url: "https://grxtor.com",
      image: "https://grxtor.com/me.png",
      jobTitle: "Web Designer & Music Producer",
      description: DATA.description,
      email: "info@grxtor.com",
      nationality: {
        "@type": "Country",
        name: "Turkey",
      },
      sameAs: [
        "https://github.com/grxtor",
        "https://linkedin.com/in/grxtor",
        "https://x.com/grxtor",
        "https://youtube.com/@grxtor",
        "https://open.spotify.com/artist/3Oohh6pTxKXeLNeLXgalhe",
      ],
      knowsAbout: [
        "Web Design",
        "Web Development",
        "Music Production",
        "Brazilian Funk",
        "Phonk",
        "UI/UX Design",
      ],
      founder: {
        "@type": "Organization",
        name: "The Lost Label",
        url: "https://thelostlabel.com",
        description: "Independent music label releasing Brazilian Funk and Phonk music",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://grxtor.com/#website",
      url: "https://grxtor.com",
      name: "GRXTOR — Abdullah Hüseyin Efe",
      description: DATA.description,
      author: { "@id": "https://grxtor.com/#person" },
    },
  ]).replace(/</g, "\\u003c");

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection work={DATA.work} />
          </BlurFade>
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                  {skill.icon && <skill.icon className="size-4 rounded overflow-hidden object-contain" />}
                  <span className="text-foreground text-sm font-medium">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="projects">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection />
        </BlurFade>
      </section>
      <section id="music">
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-xl font-bold">Music</h2>
            <SpotifyWidget artistId={DATA.spotifyArtistId} />
          </div>
        </BlurFade>
      </section>
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
