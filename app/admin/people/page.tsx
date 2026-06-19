import { BusinessCmsManager } from "@/components/admin/business-cms-manager";

export default function AdminPeoplePage() {
  return (
    <BusinessCmsManager
      title="People"
      eyebrow="Business Core"
      endpoint="/api/admin/people"
      listKey="people"
      itemKey="person"
      emptyLabel="Chưa có person nào."
      fields={[
        { name: "name", label: "Tên", required: true },
        { name: "slug", label: "Slug" },
        { name: "title", label: "Chức danh" },
        { name: "phone", label: "Số điện thoại", type: "tel" },
        { name: "status", label: "Trạng thái", type: "status" },
        { name: "display_order", label: "Thứ tự", type: "number" },
        {
          name: "is_featured",
          label: "Featured founder/person",
          type: "checkbox",
        },
        { name: "profile_enabled", label: "Bật profile", type: "checkbox" },
        {
          name: "avatar_url",
          label: "Avatar URL",
          type: "url",
          uploadFolder: "people",
        },
        { name: "bio", label: "Tiểu sử", type: "textarea" },
        {
          name: "expertise",
          label: "Expertise (mỗi dòng một mục)",
          type: "lines",
        },
        {
          name: "credentials",
          label: "Credentials (mỗi dòng một mục)",
          type: "lines",
        },
        {
          name: "social_links",
          label: "Social links (key=url, mỗi dòng)",
          type: "social",
        },
      ]}
    />
  );
}
