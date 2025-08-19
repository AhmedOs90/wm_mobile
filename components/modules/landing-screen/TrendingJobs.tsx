import { useQuery } from "@tanstack/react-query";
import { jobsControllerGetTrendingJobs } from "@sdk.gen.ts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type TrendingJob = {
  id: string;
  title: string;
  location: string | null;
  logo: string | null;
  salary: number | null;
  jobWorkplace: string | null;
  employer: {
    id: string;
    employer_profile: {
      country: {
        country: string;
      } | null;
      companyName: string | null;
    } | null;
  } | null;
};

interface TrendingJobsApiResponse {
  status: string;
  data: TrendingJob[];
  meta: {
    total: number;
  };
}

const styleVariants = [
  {
    bg: "bg-primary/5",
    iconBg: "bg-primary",
    text: "text-primary",
  },
  {
    bg: "bg-accent/5",
    iconBg: "bg-accent",
    text: "text-accent",
  },
  {
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-600",
  },
];

const TrendingJobs = () => {
  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useQuery<TrendingJob[], Error>({
    queryKey: ["trending-jobs"],
    queryFn: async () => {
      const response = await jobsControllerGetTrendingJobs();
      return (response.data as TrendingJobsApiResponse).data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-sm">
        Failed to load trending jobs: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Trending Jobs</h3>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              Live
            </Badge>
          </div>
          <div className="space-y-4">
            {jobs && jobs.length > 0 ? (
              jobs.map((job, index) => {
                const variant = styleVariants[index % styleVariants.length];

                return (
                  <div
                    key={job.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${variant.bg}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 ${variant.iconBg} rounded-lg overflow-hidden flex items-center justify-center`}
                      >
                        <img
                          src={`${job?.logo || "/assets/company-logo.jpg"}`}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.employer?.employer_profile?.companyName ??
                            "Unknown Company"}{" "}
                          •{" "}
                          {job.employer?.employer_profile?.country?.country ??
                            "Unknown Location"}
                        </div>
                      </div>
                    </div>
                    {job.salary && (<div className="text-right">
                      <div className={`font-semibold ${variant.text}`}>
                        {job.salary ?? "Salary not provided"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {"Salary"}
                      </div>
                    </div>)}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground">No trending jobs found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingJobs;
