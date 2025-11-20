/**
 * Postcode Lookup Service
 * Uses reverse geocoding to find postcodes from GPS coordinates
 */

export interface IPostcodeResult {
  postcode: string;
  address: string;
  success: boolean;
  error?: string;
}

export class PostcodeLookupService {
  
  /**
   * Lookup postcode using UK government postcode API and OpenStreetMap
   */
  public static async lookupPostcode(latitude: number, longitude: number): Promise<IPostcodeResult> {
    try {
      console.log(`Looking up postcode for coordinates: ${latitude}, ${longitude}`);
      
      // Try UK Postcode API first (for UK coordinates)
      if (latitude >= 49.5 && latitude <= 61 && longitude >= -8 && longitude <= 2) {
        try {
          const ukResult = await this.lookupUKPostcode(latitude, longitude);
          if (ukResult.success) {
            return ukResult;
          }
        } catch (error) {
          console.warn('UK postcode lookup failed, trying alternative:', error);
        }
      }
      
      // Fallback to Nominatim (OpenStreetMap) for international locations
      return await this.lookupNominatimPostcode(latitude, longitude);
      
    } catch (error) {
      console.error('Postcode lookup failed:', error);
      return {
        postcode: 'Unknown',
        address: 'Address lookup failed',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * UK-specific postcode lookup using postcodes.io API
   */
  private static async lookupUKPostcode(latitude: number, longitude: number): Promise<IPostcodeResult> {
    const url = `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`UK postcode API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 200 && data.result && data.result.length > 0) {
      const nearest = data.result[0];
      return {
        postcode: nearest.postcode,
        address: `${nearest.admin_district}, ${nearest.country}`,
        success: true
      };
    }
    
    throw new Error('No UK postcode found for coordinates');
  }

  /**
   * International postcode lookup using Nominatim (OpenStreetMap)
   */
  private static async lookupNominatimPostcode(latitude: number, longitude: number): Promise<IPostcodeResult> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NanoWorld GPS Tracker'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const postcode = address.postcode || address.postal_code || 'No postcode';
      
      const addressParts = [
        address.house_number,
        address.road,
        address.suburb || address.neighbourhood,
        address.city || address.town || address.village,
        address.state || address.county,
        address.country
      ].filter(Boolean);
      
      return {
        postcode: postcode,
        address: addressParts.join(', '),
        success: true
      };
    }
    
    throw new Error('No address data found for coordinates');
  }

  /**
   * Batch lookup multiple coordinates
   */
  public static async batchLookupPostcodes(coordinates: { lat: number; lon: number }[]): Promise<IPostcodeResult[]> {
    const results: IPostcodeResult[] = [];
    
    // Add small delays between requests to be respectful to APIs
    for (let i = 0; i < coordinates.length; i++) {
      const coord = coordinates[i];
      
      try {
        const result = await this.lookupPostcode(coord.lat, coord.lon);
        results.push(result);
        
        // Small delay between requests (500ms)
        if (i < coordinates.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to lookup postcode for coordinate ${i}:`, error);
        results.push({
          postcode: 'Error',
          address: 'Lookup failed',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return results;
  }

  /**
   * Simple distance-based postcode caching to avoid duplicate lookups
   */
  private static postcodeCache: Map<string, IPostcodeResult> = new Map();
  
  public static async lookupPostcodeWithCache(latitude: number, longitude: number, cacheRadius: number = 0.001): Promise<IPostcodeResult> {
    // Create a cache key based on rounded coordinates
    const roundedLat = Math.round(latitude / cacheRadius) * cacheRadius;
    const roundedLon = Math.round(longitude / cacheRadius) * cacheRadius;
    const cacheKey = `${roundedLat.toFixed(6)},${roundedLon.toFixed(6)}`;
    
    // Check cache first
    if (this.postcodeCache.has(cacheKey)) {
      console.log('Returning cached postcode for:', cacheKey);
      return this.postcodeCache.get(cacheKey)!;
    }
    
    // Lookup and cache result
    const result = await this.lookupPostcode(latitude, longitude);
    this.postcodeCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Clear the postcode cache
   */
  public static clearCache(): void {
    this.postcodeCache.clear();
  }
}