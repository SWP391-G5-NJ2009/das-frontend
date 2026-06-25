import { useCallback, useEffect, useState } from "react";
import { profileService } from "../services/profile.service";

export function useMyProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setProfile(await profileService.getMe());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (payload) => {
    const data = await profileService.updateMe(payload);
    setProfile(data);
    return data;
  }, []);

  return {
    error,
    isLoading,
    profile,
    updateProfile,
  };
}
