import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminCategoriesPage() {
  return (
    <ResourceManager
      title="Chuyên mục"
      eyebrow="Taxonomy"
      endpoint="/api/admin/categories"
      listKey="categories"
      emptyLabel="Chưa có chuyên mục nào."
      fields={[
        { name: "name", label: "Tên chuyên mục", required: true },
        { name: "slug", label: "Slug", placeholder: "auto từ tên" },
        { name: "description", label: "Mô tả", type: "textarea" },
        { name: "display_order", label: "Thứ tự hiển thị", type: "number" },
      ]}
    />
  );
}
