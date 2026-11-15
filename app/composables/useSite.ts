import { contentRepository } from '~/repositories/ContentRepository'
import type { NowItem } from '~/models/Content'

export interface SocialLink {
  label: string
  url: string
}

// Site-wide settings from content/site.json, with the small bits of presentation logic that
// the header, footer and home page share.
export function useSite() {
  const site = contentRepository.getSite()

  const socialLinkCollection: SocialLink[] = [
    { label: 'GitHub', url: site.githubUrl },
    { label: 'LinkedIn', url: site.linkedinUrl },
    { label: 'Email', url: site.email ? `mailto:${site.email}` : '' }
  ].filter((socialLink) => socialLink.url)

  function getNowText(nowItem: NowItem) {
    return nowItem.label ? `${nowItem.label}: ${nowItem.value}` : nowItem.value
  }

  function getFooterText(isHomePage: boolean) {
    return [isHomePage ? site.signOff : '', site.work].filter(Boolean).join(' ')
  }

  return { site, socialLinkCollection, getNowText, getFooterText }
}
