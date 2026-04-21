/** Parse embedded `profiles` from PostgREST (`object` or single-element array). */
export function pickProfileNameFromEmbed(profiles: unknown): string | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) {
    const n = profiles[0]?.full_name;
    return typeof n === 'string' && n.trim() ? n.trim() : null;
  }
  if (typeof profiles === 'object' && profiles !== null && 'full_name' in profiles) {
    const n = (profiles as { full_name?: string | null }).full_name;
    return typeof n === 'string' && n.trim() ? n.trim() : null;
  }
  return null;
}
