export type CVSectionType =
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "languages"
  | "other";

export type CVSection = {
  type: CVSectionType;
  text: string;
};

export type StructuredCV = {
  id: string;
  personal: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  sections: CVSection[];
};
