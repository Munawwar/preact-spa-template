const sizeMap = {
  small: 16,
  medium: 24,
  large: 36,
};

const getSize = (size) => sizeMap[size] || size || sizeMap.medium;

/**
 * @param {string} svgUrl SVG url
 */
const toSvgIcon = (svgUrl, symbol = 'id') => {
  /**
   * Loosely following MUI v5's interface
   * @param {object} props
   * @param {string} [props.className]
   * @param {string} [props.color='currentColor']
   * @param {'small'|'medium'|'large'|number} [props.fontSize]
   * @param {object} [props.style]
   * @returns {import('preact').JSX.Element}
   */
  const SvgIcon = ({
    className = undefined,
    color = 'currentColor',
    fontSize = undefined,
    style = undefined,
  }) => {
    const width = getSize(fontSize);
    const height = getSize(fontSize);
    return (
      <svg
        class={className}
        style={style}
        width={width}
        height={height}
        fill={color}
      >
        <use href={`${svgUrl}#${symbol}`} />
      </svg>
    );
  };

  return SvgIcon;
};

export default toSvgIcon;
