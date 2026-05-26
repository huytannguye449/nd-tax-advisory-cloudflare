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
        { name: "status", label: "Trạng thái", type: "status" },
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
        { name: "excerpt", label: "Mô tả", type: "textarea" },
      ]}
    />
  );
}
