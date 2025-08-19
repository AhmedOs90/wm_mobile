// Dummy data for location filters
// In a real application, this would come from an API

export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
}

export const LOCATION_DATA: Country[] = [
  {
    code: 'US',
    name: 'United States',
    states: [
      {
        code: 'CA',
        name: 'California',
        cities: [
          { id: 'sf', name: 'San Francisco' },
          { id: 'la', name: 'Los Angeles' },
          { id: 'sd', name: 'San Diego' },
          { id: 'sj', name: 'San Jose' },
          { id: 'sacramento', name: 'Sacramento' }
        ]
      },
      {
        code: 'NY',
        name: 'New York',
        cities: [
          { id: 'nyc', name: 'New York City' },
          { id: 'buffalo', name: 'Buffalo' },
          { id: 'rochester', name: 'Rochester' },
          { id: 'syracuse', name: 'Syracuse' },
          { id: 'albany', name: 'Albany' }
        ]
      },
      {
        code: 'TX',
        name: 'Texas',
        cities: [
          { id: 'houston', name: 'Houston' },
          { id: 'dallas', name: 'Dallas' },
          { id: 'austin', name: 'Austin' },
          { id: 'san-antonio', name: 'San Antonio' },
          { id: 'fort-worth', name: 'Fort Worth' }
        ]
      }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      {
        code: 'ON',
        name: 'Ontario',
        cities: [
          { id: 'toronto', name: 'Toronto' },
          { id: 'ottawa', name: 'Ottawa' },
          { id: 'hamilton', name: 'Hamilton' },
          { id: 'london', name: 'London' },
          { id: 'kitchener', name: 'Kitchener' }
        ]
      },
      {
        code: 'BC',
        name: 'British Columbia',
        cities: [
          { id: 'vancouver', name: 'Vancouver' },
          { id: 'victoria', name: 'Victoria' },
          { id: 'burnaby', name: 'Burnaby' },
          { id: 'richmond', name: 'Richmond' },
          { id: 'surrey', name: 'Surrey' }
        ]
      }
    ]
  },
  {
    code: 'EG',
    name: 'Egypt',
    states: [
      {
        code: 'CAI',
        name: 'Cairo Governorate',
        cities: [
          { id: 'cairo', name: 'Cairo' },
          { id: 'new-cairo', name: 'New Cairo' },
          { id: 'heliopolis', name: 'Heliopolis' },
          { id: 'maadi', name: 'Maadi' },
          { id: 'nasr-city', name: 'Nasr City' }
        ]
      },
      {
        code: 'ALX',
        name: 'Alexandria Governorate',
        cities: [
          { id: 'alexandria', name: 'Alexandria' },
          { id: 'borg-el-arab', name: 'Borg El Arab' },
          { id: 'miami', name: 'Miami' },
          { id: 'montaza', name: 'Montaza' },
          { id: 'sidi-gaber', name: 'Sidi Gaber' }
        ]
      }
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    states: [
      {
        code: 'DU',
        name: 'Dubai',
        cities: [
          { id: 'dubai-city', name: 'Dubai City' },
          { id: 'dubai-marina', name: 'Dubai Marina' },
          { id: 'downtown-dubai', name: 'Downtown Dubai' },
          { id: 'jumeirah', name: 'Jumeirah' },
          { id: 'deira', name: 'Deira' }
        ]
      },
      {
        code: 'AD',
        name: 'Abu Dhabi',
        cities: [
          { id: 'abu-dhabi-city', name: 'Abu Dhabi City' },
          { id: 'al-ain', name: 'Al Ain' },
          { id: 'khalifa-city', name: 'Khalifa City' },
          { id: 'yas-island', name: 'Yas Island' },
          { id: 'saadiyat-island', name: 'Saadiyat Island' }
        ]
      }
    ]
  }
];

// Helper functions to get filtered data
export const getCountryOptions = () => {
  return LOCATION_DATA.map(country => ({
    value: country.code,
    label: country.name
  }));
};

export const getStateOptions = (countryCode?: string) => {
  if (!countryCode) return [];
  
  const country = LOCATION_DATA.find(c => c.code === countryCode);
  return country?.states.map(state => ({
    value: state.code,
    label: state.name
  })) || [];
};

export const getCityOptions = (countryCode?: string, stateCode?: string) => {
  if (!countryCode || !stateCode) return [];
  
  const country = LOCATION_DATA.find(c => c.code === countryCode);
  const state = country?.states.find(s => s.code === stateCode);
  return state?.cities.map(city => ({
    value: city.id,
    label: city.name
  })) || [];
};

// API Guidelines for real implementation:
/*
API ENDPOINTS TO IMPLEMENT:

1. GET /api/countries
   - Returns list of all countries
   - Response: { countries: [{ code: string, name: string }] }

2. GET /api/states?country={countryCode}
   - Returns states for a specific country
   - Response: { states: [{ code: string, name: string, countryCode: string }] }

3. GET /api/cities?country={countryCode}&state={stateCode}&search={query}
   - Returns cities filtered by country, state, and optional search query
   - Response: { cities: [{ id: string, name: string, stateCode: string, countryCode: string }] }

4. Search endpoints with autocomplete:
   - GET /api/search/countries?q={query} - Search countries by name
   - GET /api/search/states?q={query}&country={countryCode} - Search states
   - GET /api/search/cities?q={query}&country={countryCode}&state={stateCode} - Search cities

USAGE GUIDELINES:
- Implement debounced search (300ms delay) for autocomplete
- Cache results for 5-10 minutes to reduce API calls
- Limit search results to 50 items for performance
- Use progressive loading: Country -> State -> City
- Clear dependent dropdowns when parent changes (e.g., clear cities when state changes)

EXAMPLE API INTEGRATION:
```typescript
const fetchCountries = async (query?: string) => {
  const url = query ? `/api/search/countries?q=${query}` : '/api/countries';
  const response = await fetch(url);
  return response.json();
};

const fetchStates = async (countryCode: string, query?: string) => {
  const url = query 
    ? `/api/search/states?q=${query}&country=${countryCode}`
    : `/api/states?country=${countryCode}`;
  const response = await fetch(url);
  return response.json();
};

const fetchCities = async (countryCode: string, stateCode: string, query?: string) => {
  const url = query
    ? `/api/search/cities?q=${query}&country=${countryCode}&state=${stateCode}`
    : `/api/cities?country=${countryCode}&state=${stateCode}`;
  const response = await fetch(url);
  return response.json();
};
```
*/