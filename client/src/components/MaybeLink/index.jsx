import React from 'react';
import Link from 'next/link';

// Is a URL internal or to an outside site?
export const isCompleteUrl = (href) => {
  try {
    return !!new URL(href);
  } catch (e) {
    return false;
  }
};

/* Link that is either a Next.js link or a HTML link (opening in a new tab) depending on whether it
 * goes outside our site */
export default function MaybeLink({ href, as, children, ...props }) {
  return (isCompleteUrl(href) || !href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
    : <Link href={href} as={as}><a {...props}>{children}</a></Link>;
}
