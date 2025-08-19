// src/hooks/useApplyToJob.ts
import { useMutation } from "@tanstack/react-query";
import { candidatesControllerApplyToJob } from "@/wm-api/sdk.gen";
import { useToast } from "@/hooks/use-toast";

export const useApplyToJob = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await candidatesControllerApplyToJob({
        body: { jobId },
        throwOnError: true,
      });

      return response.data;
    },
    onSuccess: (res) => {
      if (res?.status === "success") {
        toast({
          title: "Application submitted successfully!",
          variant: "default",
        });
      }
    },
    onError: (error: { error: string }) => {
      const errorMessage = error?.error || "An error occurred while applying.";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    },
  });
};
