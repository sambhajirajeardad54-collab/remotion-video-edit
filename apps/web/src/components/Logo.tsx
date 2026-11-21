'use client';

import { brand } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { brandMarkSvg } from '@edu/design';
import { useId, useMemo } from 'react';

/** The Lakshya target mark. Each instance gets unique SVG ids (hidden copies must not share gradients). */
export function BrandMark({ size = 36, tile = true }: { size?: number; tile?: boolean }) {
  const prefix = `lk${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const svg = useMemo(() => brandMarkSvg({ size, background: tile ? 'tile' : 'none', scale: tile ? 0.84 : 1, idPrefix: prefix }), [size, tile, prefix]);
  return <span className="brand-mark-svg" style={{ width: size, height: size }} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Mark + wordmark ("लक्ष्य Academy" / "Lakshya Academy"). */
export function Wordmark({ size = 36, subtitle }: { size?: number; subtitle?: string }) {
  const { L } = useStudent();
  return (
    <span className="brand">
      <BrandMark size={size} />
      <span className="brand-text">
        <strong>{L(brand.name)}</strong>
        {subtitle ? <small>{subtitle}</small> : null}
      </span>
    </span>
  );
}
