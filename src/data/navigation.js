export const NAVIGATION = [
    { number: "01", label: "HOME", path: "" },
    { number: "02", label: "ABOUT", path: "about/" },
    { number: "03", label: "SERVICES", path: "services/" },
    { number: "04", label: "WORK", path: "work/" },
    { number: "05", label: "APPROACH", path: "approach/" },
    { number: "06", label: "TEAM", path: "team/" },
    { number: "07", label: "CONTACT", path: "contact/" },
  ];
  
  export function withBase(path = "") {
    const base = import.meta.env.BASE_URL || "/";
    const cleanPath = String(path).replace(/^\/+/, "");
    return `${base}${cleanPath}`.replace(/\/{2,}/g, "/");
  }
  