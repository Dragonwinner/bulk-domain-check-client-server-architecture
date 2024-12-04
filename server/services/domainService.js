import { checkDomainAvailability } from '../utils/domainChecker.js';

const BATCH_SIZE = 10;
const BATCH_DELAY = 1000; // 1 second delay between batches

export const checkDomainBatch = async (domains) => {
  const results = [];
  
  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (domain) => {
      try {
        const isAvailable = await checkDomainAvailability(domain);
        return { domain, isAvailable };
      } catch (error) {
        console.error(`Error checking domain ${domain}:`, error);
        return { domain, isAvailable: false };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (i + BATCH_SIZE < domains.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }
  
  return results;
};