import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(path.join(dataDir, filename), "utf-8");
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, filename), JSON.stringify(data, null, 2));
}

export interface ProfileData {
  name: string;
  realName: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  email: string;
  social: Record<string, { url: string; navbar: boolean }>;
  spotifyArtistId: string;
}

export interface WorkData {
  id: string;
  company: string;
  href: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
}

export interface ProjectData {
  id: string;
  title: string;
  href: string;
  dates: string;
  description: string;
  technologies: string[];
  image: string;
  video: string;
  active: boolean;
}

export async function getProfile(): Promise<ProfileData> {
  return readJsonFile<ProfileData>("profile.json", {
    name: "GRXTOR", realName: "Abdullah Hüseyin Efe", initials: "GR",
    url: "https://grxtor.com", location: "Turkey", locationLink: "",
    description: "", summary: "", avatarUrl: "/me.png", email: "info@grxtor.com",
    social: {}, spotifyArtistId: ""
  });
}

export async function getWork(): Promise<WorkData[]> {
  return readJsonFile<WorkData[]>("work.json", []);
}

export async function getSkills(): Promise<string[]> {
  return readJsonFile<string[]>("skills.json", []);
}

export async function getProjects(): Promise<ProjectData[]> {
  return readJsonFile<ProjectData[]>("projects.json", []);
}
