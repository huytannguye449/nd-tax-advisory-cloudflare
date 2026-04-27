import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SITE } from "@/lib/utils";

export function OfficeInfo() {
  return (
    <div className="rounded-lg bg-cream-100 border border-cream-300 p-6 lg:p-8 space-y-5">
      <h3 className="text-xl font-bold text-navy">Thông tin liên hệ</h3>

      <div className="space-y-4">
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
    <div className="flex items-start gap-3">
      <div className="shrink-0 size-10 rounded-md bg-navy/5 flex items-center justify-center">
        <Icon className="size-5 text-gold-700" aria-hidden />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
          {label}
        </p>
        <p className="mt-0.5 text-base text-navy font-medium">{value}</p>
        {sub && <p className="text-sm text-navy/60">{sub}</p>}
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
