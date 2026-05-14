import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SITE } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/eyebrow";

export function OfficeInfo() {
  return (
    <div className="border-t-hairline border-gold pt-6 space-y-6">
      <Eyebrow color="gold">THÔNG TIN LIÊN HỆ</Eyebrow>

      <div className="space-y-5">
        <InfoItem icon={MapPin} label="Văn phòng" value={SITE.address} />
        <InfoItem
          icon={Mail}
          label="Email"
          value={SITE.email}
          href={`mailto:${SITE.email}`}
        />
        <InfoItem
          icon={Phone}
          label="Hotline"
          value={SITE.phone}
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
        />
        <InfoItem
          icon={Clock}
          label="Giờ làm việc"
          value="T2 - T6: 9:00 - 18:00"
          sub="T7 - CN: theo lịch hẹn"
        />
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const Content = (
    <div className="flex items-start gap-4">
      <div className="shrink-0 text-gold-700 mt-0.5">
        <Icon className="size-5" aria-hidden />
      </div>
      <div>
        <p className="text-label-caps text-navy/60 uppercase tracking-[0.1em] mb-0.5">
          {label}
        </p>
        <p className="text-body-md text-navy font-medium">{value}</p>
        {sub && <p className="text-body-sm text-navy/60">{sub}</p>}
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition">
        {Content}
      </a>
    );
  }
  return Content;
}
