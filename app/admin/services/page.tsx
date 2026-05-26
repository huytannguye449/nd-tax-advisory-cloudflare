import { BusinessCmsManager } from "@/components/admin/business-cms-manager";

export default function AdminServicesPage() {
  return (
    <BusinessCmsManager
      title="Dịch vụ"
      eyebrow="Business Core"
      endpoint="/api/admin/services"
      listKey="services"
      itemKey="service"
      emptyLabel="Chưa có dịch vụ nào."
      assignPeople
      fields={[
        { name: "title", label: "Tên dịch vụ", required: true },
        { name: "slug", label: "Slug" },
        { name: "status", label: "Trạng thái", type: "status" },
        { name: "display_order", label: "Thứ tự", type: "number" },
        { name: "short_description", label: "Mô tả ngắn", type: "textarea" },
        { name: "description", label: "Nội dung dịch vụ", type: "textarea" },
        {
          name: "cover_url",
          label: "Cover URL",
          type: "url",
          uploadFolder: "services",
        },
        { name: "pricing", label: "Phí tham khảo" },
        { name: "cta_label", label: "CTA label" },
        { name: "cta_href", label: "CTA href" },
        {
          name: "when_items",
          label: "Khi nào cần (mỗi dòng một mục)",
          type: "lines",
        },
        {
          name: "process_items",
          label: "Quy trình (mỗi dòng một mục)",
          type: "lines",
        },
        {
          name: "deliverable_items",
          label: "Deliverables (mỗi dòng một mục)",
          type: "lines",
        },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
      ]}
    />
  );
}
