export function fetchWhatsappData(allSocialProfiles) {
  return allSocialProfiles?.filter(
    (profile) => profile.socialType === 'whatsapp'
  ) || null;
}