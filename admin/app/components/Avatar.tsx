import Image from "next/image";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  avatar,
  size = 36,
}: {
  name: string;
  avatar?: string;
  size?: number;
}) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-[#8B6F47]/[0.06] text-xs font-semibold text-[#8B6F47]"
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </span>
  );
}
