import { BusinessCmsManager } from "@/components/admin/business-cms-manager";

export default function AdminEventsPage() {
  return (
    <BusinessCmsManager
      title="Sự kiện"
      eyebrow="Business Core"
      endpoint="/api/admin/events"
      listKey="events"
      itemKey="event"
      emptyLabel="Chưa có sự kiện nào."
      fields={[
        { name: "title", label: "Tên sự kiện", required: true },
        { name: "slug", label: "Slug" },
        {
          name: "status",
          label: "Trạng thái",
          type: "status",
          options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
          ],
        },
        { name: "display_order", label: "Thứ tự", type: "number" },
        { name: "event_date", label: "Ngày giờ", type: "date" },
        { name: "location", label: "Địa điểm" },
        { name: "format", label: "Format" },
        {
          name: "cover_url",
          label: "Cover URL",
          type: "url",
          uploadFolder: "events",
        },
        { name: "excerpt", label: "Mô tả ngắn", type: "textarea" },
        { name: "description", label: "Mô tả chi tiết", type: "textarea" },
        {
          name: "agenda_items",
          label: "Nội dung chương trình (mỗi dòng một mục)",
          type: "lines",
        },
        {
          name: "audience_items",
          label: "Đối tượng phù hợp (mỗi dòng một mục)",
          type: "lines",
        },
        { name: "cta_label", label: "CTA label" },
        { name: "cta_href", label: "CTA URL", type: "url" },
      ]}
    />
  );
}
