// Bella+Canvas 3001 standard front template: 1800×2400 pixels at 150 DPI.
// Use a 7-inch-wide print to retain at least 150 effective DPI from the source artwork.
export const FRONT_POSITION = { area_width: 1800, area_height: 2400, width: 1050, height: 1400, top: 300, left: 375 };
type PrintFile = { id: number; type: string; status: string; width: number; height: number };
export function livePrintItem(variantId: number, quantity: number, files: PrintFile[]) {
  const front = files.find(f => ["default", "front"].includes(f.type));
  const label = files.find(f => f.type === "label_inside");
  if (!front || !label || front.status !== "ok" || label.status !== "ok"
    || front.width < 1050 || front.height < 1400) throw new Error("Print quality unavailable");
  return { sync_variant_id: variantId, quantity, files: [
    { id: front.id, type: front.type, position: FRONT_POSITION },
    { id: label.id, type: "label_inside", options: [{ id: "template_type", value: "native" }] },
  ] };
}
