import { useState, useCallback } from 'react';
import { api } from '../services/api';

export function useClaims() {
  const [claims, setClaims] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClaims = useCallback(async (uan) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClaims(uan);
      setClaims(data.claims);
      setMemberName(data.memberName);
      return data;
    } catch (err) {
      setError(err.message);
      setClaims([]);
      setMemberName('');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearClaims = useCallback(() => {
    setClaims([]);
    setMemberName('');
    setError(null);
  }, []);

  return {
    claims,
    memberName,
    loading,
    error,
    fetchClaims,
    clearClaims
  };
}
