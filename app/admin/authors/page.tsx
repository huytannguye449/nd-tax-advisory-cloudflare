import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminAuthorsPage() {
  return (
    <ResourceManager
      title="Tác giả"
      eyebrow="People"
      endpoint="/api/admin/authors"
      listKey="authors"
      emptyLabel="Chưa có tác giả nào."
      fields={[
        { name: "name", label: "Tên tác giả", required: true },
        { name: "slug", label: "Slug", placeholder: "auto từ tên" },
        { name: "title", label: "Chức danh" },
        { name: "avatar_url", label: "Avatar URL", type: "url" },
        { name: "bio", label: "Tiểu sử", type: "textarea" },
      ]}
    />
  );
}
