import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminTagsPage() {
  return (
    <ResourceManager
      title="Tags"
      eyebrow="Taxonomy"
      endpoint="/api/admin/tags"
      listKey="tags"
      emptyLabel="Chưa có tag nào."
      fields={[
        { name: "name", label: "Tên tag", required: true },
        { name: "slug", label: "Slug", placeholder: "auto từ tên" },
      ]}
    />
  );
}
