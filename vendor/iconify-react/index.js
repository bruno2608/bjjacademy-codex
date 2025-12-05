'use strict';
const React = require('react');

function Icon(props) {
  const { icon, className, style, ...rest } = props || {};
  const [svg, setSvg] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    if (!icon) {
      setSvg('');
      return undefined;
    }
    const controller = new AbortController();
    const loadSvg = async () => {
      try {
        const response = await fetch(`https://api.iconify.design/${icon}.svg`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const text = await response.text();
        if (isMounted) setSvg(text);
      } catch (err) {
        // ignore fetch errors (offline, aborted, etc.)
      }
    };
    loadSvg();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [icon]);

  return React.createElement('span', {
    className,
    style,
    dangerouslySetInnerHTML: svg ? { __html: svg } : undefined,
    'aria-hidden': rest['aria-label'] ? undefined : true,
    ...rest,
  });
}

module.exports = { Icon, default: Icon };
