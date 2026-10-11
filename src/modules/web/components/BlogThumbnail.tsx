type BlogThumbnailTone = 'primary' | 'secondary' | 'dark';

type BlogThumbnailProps = {
  slug: string;
  title: string;
  coverTitle: string;
  tone: BlogThumbnailTone;
  readingMinutes: number;
  className?: string;
};

type WindowThumbnailConfig = {
  titleLines: string[];
  titleFontSize: number;
  titleY: number;
  titleLineHeight: number;
  subtitle: string;
  subtitleFontSize: number;
  readLabel: string;
  readIcon?: 'hourglass';
  mainBoxWidth?: number;
  sidePanelX?: number;
  sidePanelWidth?: number;
  readBadgeWidth?: number;
  keypadStep?: number;
  keypadRadius?: number;
};

const fallbackToneStyles = {
  primary: {
    panel: 'bg-primary',
    text: 'text-black',
    badge: 'bg-black text-primary',
  },
  secondary: {
    panel: 'bg-secondary',
    text: 'text-white',
    badge: 'bg-white text-secondary',
  },
  dark: {
    panel: 'bg-background-dark',
    text: 'text-white',
    badge: 'bg-primary text-black',
  },
} as const;

const customThumbnails: Record<string, WindowThumbnailConfig> = {
  'compliance-competitive-advantage': {
    titleLines: [
      'HOW COMPANIES TURN',
      'COMPLIANCE INTO A',
      'COMPETITIVE ADVANTAGE',
    ],
    titleFontSize: 46,
    titleY: 282,
    titleLineHeight: 74,
    subtitle: 'Episode 1 Recap + Free Downloads',
    subtitleFontSize: 30,
    readLabel: '2-Mins Read',
  },
  'how-secure-is-your-most-sensitive-data': {
    titleLines: [
      'HOW SECURE IS YOUR MOST',
      'SENSITIVE DATA?',
    ],
    titleFontSize: 44,
    titleY: 323,
    titleLineHeight: 76,
    subtitle: 'Podcast Episode 2 - Recap',
    subtitleFontSize: 28,
    readLabel: '2-Min Read',
    readIcon: 'hourglass',
    mainBoxWidth: 855,
    sidePanelX: 960,
    sidePanelWidth: 238,
    readBadgeWidth: 225,
    keypadStep: 54,
    keypadRadius: 26,
  },
  'navigating-sebis-cscrf': {
    titleLines: [
      "NAVIGATING SEBI'S CSCRF:",
      '3 THINGS TO FIX BEFORE',
      "IT'S TOO LATE!",
    ],
    titleFontSize: 49,
    titleY: 280,
    titleLineHeight: 72,
    subtitle: 'What Is CSCRF and Why Should You Care?',
    subtitleFontSize: 28,
    readLabel: '2-Mins Read',
    mainBoxWidth: 855,
    sidePanelX: 960,
    sidePanelWidth: 238,
    keypadStep: 54,
    keypadRadius: 26,
  },
};

function HourglassIcon({
  x,
  y,
}: {
  x: number;
  y: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 0h14M0 20h14M2 1c0 4 2 6 5 8-3 2-5 4-5 8M12 1c0 4-2 6-5 8 3 2 5 4 5 8"
        fill="none"
        stroke="#111111"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="M4 5h6L7 9z" fill="#111111" />
      <path d="M4 15h6l-3-4z" fill="#111111" />
    </g>
  );
}

function LockedWindowThumbnail({
  className,
  config,
}: {
  className?: string;
  config: WindowThumbnailConfig;
}) {
  const browserScale = 1.14;
  const mainBoxX = 95;
  const mainBoxY = 224;
  const mainBoxWidth = config.mainBoxWidth ?? 830;
  const mainBoxHeight = 250;
  const sidePanelX = config.sidePanelX ?? 936;
  const sidePanelWidth = config.sidePanelWidth ?? 256;
  const sidePanelCenterX = sidePanelX + sidePanelWidth / 2;
  const subtitleY = 488;
  const readBadgeWidth = config.readBadgeWidth ?? 205;
  const readBadgeX = mainBoxX + mainBoxWidth - readBadgeWidth;
  const readBadgeCenter = readBadgeX + readBadgeWidth / 2;
  const keypadStep = config.keypadStep ?? 64;
  const keypadRadius = config.keypadRadius ?? 28;
  const keypadXs = [
    sidePanelCenterX - keypadStep,
    sidePanelCenterX,
    sidePanelCenterX + keypadStep,
  ];
  const lockBodyX = sidePanelCenterX - 22;
  const lockBodyY = 291;
  const lockShackleY = 275;
  const bottomLineStartX = sidePanelCenterX - 20;
  const bottomLineEndX = sidePanelCenterX + 20;

  return (
    <div className={className}>
      <svg
        aria-label="Blog thumbnail"
        className="block h-full w-full"
        role="img"
        viewBox="0 0 1280 720"
      >
        <rect fill="#1FA0DA" height="720" width="1280" />
        <g transform={`translate(640 362) scale(${browserScale}) translate(-640 -362)`}>
          <rect
            fill="#ECEFF5"
            height="572"
            rx="30"
            stroke="#111111"
            strokeWidth="2"
            width="1132"
            x="74"
            y="76"
          />

          <circle cx="110" cy="104" fill="#FF645C" r="10" stroke="#111111" strokeWidth="2" />
          <circle cx="139" cy="104" fill="#FFC543" r="10" stroke="#111111" strokeWidth="2" />
          <circle cx="168" cy="104" fill="#D8FF4A" r="10" stroke="#111111" strokeWidth="2" />

          <rect
            fill="#E4E8F0"
            height="80"
            rx="24"
            stroke="#111111"
            strokeWidth="2"
            width="1090"
            x="95"
            y="132"
          />

          {[
            { fill: '#FFE51A', text: 'Cyber', x: 144, width: 117 },
            { fill: '#F4F6FA', text: 'Protect', x: 270, width: 117 },
            { fill: '#FFE51A', text: 'Data', x: 396, width: 117 },
            { fill: '#F4F6FA', text: 'Threat', x: 522, width: 117 },
            { fill: '#FFE51A', text: 'Security', x: 648, width: 117 },
            { fill: '#F4F6FA', text: 'Attack', x: 774, width: 117 },
            { fill: '#FFE51A', text: 'Firewall', x: 900, width: 117 },
            { fill: '#F4F6FA', text: 'Malware', x: 1026, width: 117 },
          ].map((chip) => (
            <g key={chip.text}>
              <rect
                fill={chip.fill}
                height="40"
                rx="20"
                stroke="#111111"
                strokeWidth="2"
                width={chip.width}
                x={chip.x}
                y="152"
              />
              <text
                fill="#111111"
                fontFamily="Space Grotesk, sans-serif"
                fontSize="20"
                fontWeight="500"
                textAnchor="middle"
                x={chip.x + chip.width / 2}
                y="178"
              >
                {chip.text}
              </text>
            </g>
          ))}

          <rect
            fill="#F2F4F8"
            height={mainBoxHeight}
            rx="26"
            stroke="#111111"
            strokeWidth="2"
            width={mainBoxWidth}
            x={mainBoxX}
            y={mainBoxY}
          />

          <text
            fill="#040404"
            fontFamily="Montserrat, Space Grotesk, sans-serif"
            fontSize={config.titleFontSize}
            fontWeight="800"
            textAnchor="middle"
            x={mainBoxX + mainBoxWidth / 2}
            y={config.titleY}
          >
            {config.titleLines.map((line, index) => (
              <tspan
                key={`${line}-${index}`}
                dy={index === 0 ? 0 : config.titleLineHeight}
                x={mainBoxX + mainBoxWidth / 2}
              >
                {line}
              </tspan>
            ))}
          </text>

          <rect
            fill="#050505"
            height="411"
            rx="26"
            stroke="#111111"
            strokeWidth="2"
            width={sidePanelWidth}
            x={sidePanelX}
            y="224"
          />

          <g fill="none" stroke="#F3F5FA" strokeWidth="6">
            <path
              d={`M${sidePanelCenterX - 20} ${lockShackleY}a20 20 0 0 1 40 0v16h-12v-16a8 8 0 0 0-16 0v16h-12z`}
            />
            <rect fill="#F3F5FA" height="36" rx="4" width="44" x={lockBodyX} y={lockBodyY} />
            <circle cx={sidePanelCenterX} cy="308" fill="#050505" r="4" stroke="none" />
            <rect fill="#050505" height="10" width="4" x={sidePanelCenterX - 2} y="308" />
          </g>

          {[
            ...[361, 431, 501].flatMap((cy) =>
              keypadXs.map((cx) => ({
                cx,
                cy,
              })),
            ),
            { cx: sidePanelCenterX, cy: 570 },
          ].map((point) => (
            <circle
              key={`${point.cx}-${point.cy}`}
              cx={point.cx}
              cy={point.cy}
              fill="none"
              r={keypadRadius}
              stroke="#F3F5FA"
              strokeWidth="4"
            />
          ))}

          <path
            d={`M${bottomLineStartX} 618h${bottomLineEndX - bottomLineStartX}`}
            fill="none"
            stroke="#F3F5FA"
            strokeLinecap="round"
            strokeWidth="4"
          />

          <rect
            fill="#F2F4F8"
            height="70"
            rx="18"
            stroke="#111111"
            strokeWidth="2"
            width={mainBoxWidth}
            x={mainBoxX}
            y={subtitleY}
          />
          <text
            fill="#111111"
            fontFamily="Space Grotesk, sans-serif"
            fontSize={config.subtitleFontSize}
            fontWeight="500"
            textAnchor="middle"
            x={mainBoxX + mainBoxWidth / 2}
            y="531"
          >
            {config.subtitle}
          </text>

          <rect
            fill="#F2F4F8"
            height="42"
            rx="12"
            stroke="#111111"
            strokeWidth="2"
            width="205"
            x="95"
            y="571"
          />
          <text
            fill="#111111"
            fontFamily="Space Grotesk, sans-serif"
            fontSize="18"
            fontWeight="500"
            x="131"
            y="598"
          >
            DATASENTRY
          </text>

          <g fill="none" stroke="#111111" strokeWidth="3" transform="translate(510 585)">
            <path d="M-7 1a7 7 0 0 1 14 0v6h-4V1a3 3 0 0 0-6 0v6h-4z" />
            <rect fill="#111111" height="12" rx="1" stroke="none" width="14" x="-7" y="7" />
            <circle cx="0" cy="12" fill="#F2F4F8" r="1.5" stroke="none" />
            <rect fill="#F2F4F8" height="3" stroke="none" width="1.5" x="-0.75" y="12" />
          </g>

          <rect
            fill="#F2F4F8"
            height="42"
            rx="12"
            stroke="#111111"
            strokeWidth="2"
            width={readBadgeWidth}
            x={readBadgeX}
            y="571"
          />

          {config.readIcon === 'hourglass' ? (
            <>
              <HourglassIcon x={readBadgeX + 20} y={582} />
              <text
                fill="#111111"
                fontFamily="Space Grotesk, sans-serif"
                fontSize="18"
                fontWeight="500"
                x={readBadgeX + 54}
                y="598"
              >
                {config.readLabel}
              </text>
            </>
          ) : (
            <text
              fill="#111111"
              fontFamily="Space Grotesk, sans-serif"
              fontSize="18"
              fontWeight="500"
              textAnchor="middle"
              x={readBadgeCenter}
              y="598"
            >
              {config.readLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}

export default function BlogThumbnail({
  slug,
  title,
  coverTitle,
  tone,
  readingMinutes,
  className,
}: BlogThumbnailProps) {
  const customThumbnail = customThumbnails[slug];

  if (customThumbnail) {
    return (
      <LockedWindowThumbnail
        className={`overflow-hidden bg-[#1FA0DA] ${className ?? ''}`}
        config={customThumbnail}
      />
    );
  }

  const toneStyle = fallbackToneStyles[tone];
  const firstLine = title.split(':')[0];

  return (
    <div
      className={`${toneStyle.panel} ${toneStyle.text} ${className ?? ''} relative overflow-hidden p-6 flex flex-col justify-between`}
    >
      <span className={`inline-block ${toneStyle.badge} border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase mb-5`}>
        {coverTitle}
      </span>
      <h3 className="font-display text-3xl md:text-4xl font-black uppercase leading-none relative z-10">
        {firstLine}
      </h3>
      <p className="font-mono text-xs uppercase relative z-10">
        {readingMinutes}
        {' '}
        min read
      </p>
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '18px 18px' }}
      ></div>
    </div>
  );
}
