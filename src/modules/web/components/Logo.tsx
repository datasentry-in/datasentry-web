export default function Logo({ className = "h-10 w-auto", strokeColor = "#F5C200" }: { className?: string, strokeColor?: string }) {
  return (
    <svg className={className} viewBox="0 0 560 118" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="560" height="118" fill="#ffffff" />
      <rect x="1.5" y="1.5" width="557" height="115" fill="none" stroke={strokeColor} strokeWidth="3" />
      <rect x="1.5" y="1.5" width="232" height="115" fill="#009FE3" />
      <text
        x="116"
        y="74"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="700"
        fontSize="56"
        letterSpacing="7"
        textAnchor="middle"
        fill="#ffffff"
      >
        DATA
      </text>
      <text
        x="396"
        y="74"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="56"
        letterSpacing="-1"
        textAnchor="middle"
        fill="#07090c"
      >
        SENTRY
      </text>
    </svg>
  );
}
