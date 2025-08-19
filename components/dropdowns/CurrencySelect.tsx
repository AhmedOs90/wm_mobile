import { useEffect, useState } from 'react';
import { staticDataControllerGetCurrencies } from"@/wm-api/sdk.gen.ts";
import type { Currency } from '@/wm-api/types.gen.ts';
import Select, { SelectOption } from '../ui/select';

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CurrencySelect = ({
  value,
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
}: CurrencySelectProps) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await staticDataControllerGetCurrencies();
        if (response.data?.data) {
          setCurrencies(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const currencyOptions: SelectOption[] = currencies.map((currency) => ({
    label: currency.name,
    value: currency.id,
  }));

  return (
    <Select
      data={currencyOptions}
      value={value}
      onChange={(selected) => onValueChange(String(selected.value))}
      placeholder={loading ? 'Loading...' : placeholder}
      disabled={disabled || loading}
    />
  );
};
