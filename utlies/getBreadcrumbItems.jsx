export function getBreadcrumbItems(pathname, searchParams) {
  if (!pathname.startsWith("/dashboard")) return [];

  const cleanPath = pathname.split("?")[0];
  const segments = cleanPath.split("/").filter(Boolean);
  const parts = segments.slice(1);
  const result = [];

  const isEdit = searchParams?.has("edit");

  parts.forEach((part, index) => {
    let name = part;

    if (part === "form") {
      name = isEdit ? "edit" : "create";
    } else {
      name = `${part.replaceAll("-", " ")} list`;
    }

    result.push({
      name,
      href: "/dashboard/" + parts.slice(0, index + 1).join("/"),
    });
  });

  return result;
}
