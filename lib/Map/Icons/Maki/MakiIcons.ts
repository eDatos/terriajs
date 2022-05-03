import icons from "./iconset-all_maki_icons.json";

export function getMakiIcon(
  id: string,
  color: string,
  strokeWidth: number,
  strokeColor: string,
  height: number,
  width: number
) {
  const svgId = `${id}.svg`;
  const iconSvgs = icons.iconGroups[0].svgs as any;
  if (svgId in iconSvgs) {
    const path = iconSvgs[svgId].pathData[0].d;
    const totalHeight = height + 4 + strokeWidth * 2;
    const totalWidth = width + 4 + strokeWidth * 2;
    const translate = Math.floor(2 + strokeWidth);
    const scaleHeight = height / 15;
    const scaleWidth = width / 15;

    return `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalHeight} ${totalWidth}" height="${totalHeight}" width="${totalWidth}"><title>${svgId}</title><rect fill="none" x="0" y="0" width="${totalWidth}" height="${totalHeight}"></rect><path fill="${strokeColor}" transform="translate(${translate} ${translate}) scale(${scaleWidth} ${scaleHeight})" d="${path}" style="stroke-linejoin:round;stroke-miterlimit:4;" stroke="${strokeColor}" stroke-width="${strokeWidth}"></path><path fill="${color}" transform="translate(${translate} ${translate}) scale(${scaleWidth} ${scaleHeight})"  d="${path}" ></path></svg>`
    )}`;
  }
}
