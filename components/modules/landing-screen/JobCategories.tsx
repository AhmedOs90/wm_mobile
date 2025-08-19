import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { staticDataControllerGetCategories } from "@sdk.gen.ts";
import { StaticDataControllerGetCategoriesResponse } from "@types.gen.ts";
import { Skeleton } from "@/components/ui/skeleton";

const JobCategories = () => {
  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<StaticDataControllerGetCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: () => staticDataControllerGetCategories().then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load categories: {error.message}
      </div>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Job Categories
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore opportunities across different industries
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories?.data?.length > 0 &&
            categories.data.map((category) => (
              <Card
                key={category.id}
                className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  {/* category - icon not found in API response */}
                  {/* <div className="text-3xl mb-3">{category.icon}</div> */}
                  <div className="flex justify-center">
                    <img
                      src="https://placehold.co/44x44"
                      alt="icon"
                      className="rounded-full mb-4 block"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {category.categoryName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.Job?.length} Jobs
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
