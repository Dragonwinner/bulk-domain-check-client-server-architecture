import { DomainResult } from '../types';

export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const processDomainBatch = async (
  domains: string[],
  timeout: number
): Promise<Map<string, boolean>> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch('http://localhost:3000/api/check-domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domains }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const results = new Map<string, boolean>();
    
    data.results.forEach((result: { domain: string; isAvailable: boolean }) => {
      results.set(result.domain, result.isAvailable);
    });

    return results;
  } catch (error) {
    console.error('Error processing domains:', error);
    return new Map(domains.map(domain => [domain, false]));
  }
};