import "./GarlandDivider.css";

/**
 * The page's signature element: a strand of jasmine buds (మల్లెపూలు),
 * echoing how each diary entry is another flower strung onto the
 * garland of your days. Used between entries and as a section marker.
 */
export default function GarlandDivider({ count = 9 }) {
  const buds = Array.from({ length: count });
  return (
    <div className="garland" role="presentation" aria-hidden="true">
      <svg className="garland-thread" viewBox={`0 0 ${count * 40} 20`} preserveAspectRatio="none">
        <path
          d={`M 0 4 ${buds
            .map((_, i) => `Q ${i * 40 + 20} 18 ${i * 40 + 40} 4`)
            .join(" ")}`}
          fill="none"
          stroke="var(--color-dusk-700)"
          strokeWidth="1"
        />
      </svg>
      <div className="garland-buds">
        {buds.map((_, i) => (
          <span
            className="garland-bud"
            key={i}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}
