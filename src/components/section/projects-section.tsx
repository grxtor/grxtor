import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Icons } from "@/components/icons";
import { getProjects } from "@/lib/data";

const BLUR_FADE_DELAY = 0.04;

export default async function ProjectsSection() {
  const projects = await getProjects();

  const allProjects = projects.map((p) => ({
    ...p,
    links: [
      {
        type: "Website",
        href: p.href,
        icon: <Icons.globe className="size-3" />,
      },
    ],
  }));

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-primary-foreground text-sm font-medium">My Projects</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Check out my latest work</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              Web design, music labels, and creative digital projects.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto auto-rows-fr">
          {allProjects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              className="h-full"
            >
              <ProjectCard
                href={project.href}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video || ""}
                links={project.links as { type: string; href: string; icon: React.ReactNode }[]}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
