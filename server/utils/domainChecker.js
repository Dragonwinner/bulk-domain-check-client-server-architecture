import fetch from 'node-fetch';
import dns from 'dns/promises';

export const checkDomainAvailability = async (domain) => {
  try {
    const cleanDomain = domain.trim().toLowerCase();
    
    try {
      await dns.resolve(cleanDomain, 'SOA');
      return false; // Domain exists (is registered)
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
        const endpoints = [
          `https://dns.google/resolve?name=${cleanDomain}&type=SOA`,
          `https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=SOA`
        ];

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              headers: {
                'Accept': 'application/dns-json'
              }
            });

            if (!response.ok) continue;

            const data = await response.json();

            if (data.Answer && data.Answer.length > 0) {
              return false; // Domain is registered
            }

            if (data.Status === 0 || data.Status === 3) {
              return true; // Domain might be available
            }
          } catch (error) {
            console.error(`Error with endpoint ${endpoint}:`, error);
            continue;
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error(`Error checking domain ${domain}:`, error);
    return false;
  }
};