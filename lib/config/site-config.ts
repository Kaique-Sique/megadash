export const siteConfig = {
  name: "Megadash",
  description: "FRC dashboard for NetworkTables v4 from megazord 7563",
  teamName: "SESI SENAI MEGAZORD #7563",
  teamNumber: 7563,
  teamRegion: "Brazil",
  teamCity: "São Paulo",
  teamShortName: "MegaZord",
  foundedYear: 2019,
};

export const contactInfo = [
  { label: "GitHub", href: "https://github.com/megazord7563", icon: "github" },
  { label: "Instagram", href: "https://instagram.com/megazord7563", icon: "instagram" },
  { label: "Site", href: "https://megazord7563.com.br", icon: "web" },
] as const;

/** Links principais da barra de navegação (Settings fica separado, à direita). */
export const navLinks = [
  { label: "Overview", href: "/", description: "Resumo da conexão e do robô." },
  { label: "Autonomous", href: "/autonomous", description: "Autonomous selection and monitoring." },
  { label: "Teleop", href: "/teleop", description: "Panel for the period controlled by the pilots." },
  { label: "Field", href: "/field", description: "Robot pose and trajectories on the 2D field." },
  { label: "Diagnostics", href: "/diagnostics", description: "Battery, CAN, brownouts, and latency." },
  { label: "Topics", href: "/topics", description: "Explorer for all NetworkTables topics." },
] as const;
